import prisma from '../db/prisma.js';

function httpError(status, message, details) {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
}

function parseId(param, name = 'id') {
  const id = Number.parseInt(param, 10);
  if (Number.isNaN(id)) throw httpError(400, `Invalid ${name}`);
  return id;
}

// Create reservation for a LOANED book
export async function createReservation(userId, { bookId }) {
  if (!bookId) throw httpError(400, 'bookId is required');

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw httpError(404, 'Book not found', ['Book not found']);

  if (book.status !== 'LOANED') {
    throw httpError(422, 'Reservation allowed only for LOANED books');
  }

  const existing = await prisma.reservation.findFirst({
    where: { bookId, status: 'ACTIVE' }
  });
  if (existing) {
    throw httpError(409, 'Book already has an ACTIVE reservation', [
      'Book already has an ACTIVE reservation'
    ]);
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48h hold window

  return prisma.reservation.create({
    data: {
      userId,
      bookId,
      status: 'ACTIVE',
      createdAt: now,
      expiresAt
    }
  });
}

// Admins/librarians see all, users see their own
export async function listReservationsForUser(user) {
  if (user.role === 'ADMIN' || user.role === 'LIBRARIAN') {
    return prisma.reservation.findMany();
  }
  return prisma.reservation.findMany({
    where: { userId: user.id }
  });
}

export async function getReservationForUser(user, idParam) {
  const id = parseId(idParam, 'reservation id');

  const reservation = await prisma.reservation.findUnique({
    where: { id }
  });

  if (!reservation) throw httpError(404, 'Reservation not found');

  if (
    user.role !== 'ADMIN' &&
    user.role !== 'LIBRARIAN' &&
    reservation.userId !== user.id
  ) {
    throw httpError(403, 'Forbidden');
  }

  return reservation;
}

export async function cancelReservation(user, idParam) {
  const reservation = await getReservationForUser(user, idParam);

  if (reservation.status !== 'ACTIVE') {
    throw httpError(400, 'Only ACTIVE reservations can be cancelled');
  }

  return prisma.reservation.update({
    where: { id: reservation.id },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date()
    }
  });
}

// Fulfill reservation: librarian/admin converts reservation to a Loan
export async function fulfillReservation(idParam, { startDate, dueDate }) {
  const id = parseId(idParam, 'reservation id');

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { book: true, user: true }
  });

  if (!reservation) throw httpError(404, 'Reservation not found');
  if (reservation.status !== 'ACTIVE') {
    throw httpError(400, 'Reservation is not ACTIVE');
  }

  const activeLoan = await prisma.loan.findFirst({
    where: { bookId: reservation.bookId, status: 'ACTIVE' }
  });
  if (activeLoan) {
    throw httpError(409, 'Book already has an ACTIVE loan');
  }

  if (!startDate || !dueDate) {
    throw httpError(400, 'startDate and dueDate are required');
  }

  const loan = await prisma.loan.create({
    data: {
      userId: reservation.userId,
      bookId: reservation.bookId,
      startDate: new Date(startDate),
      dueDate: new Date(dueDate),
      status: 'ACTIVE'
    }
  });

  await prisma.reservation.update({
    where: { id: reservation.id },
    data: {
      status: 'FULFILLED',
      fulfilledAt: new Date()
    }
  });

  await prisma.book.update({
    where: { id: reservation.bookId },
    data: { status: 'LOANED' }
  });

  return {
    reservationId: reservation.id,
    status: 'FULFILLED',
    loan
  };
}
