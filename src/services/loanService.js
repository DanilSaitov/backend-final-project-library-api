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

// Create loan (Librarian/Admin)
export async function createLoan({ bookId, userId, startDate, dueDate }) {
  if (!bookId || !userId || !startDate || !dueDate) {
    throw httpError(400, 'bookId, userId, startDate, and dueDate are required');
  }

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw httpError(404, 'Book not found');

  const existingLoan = await prisma.loan.findFirst({
    where: { bookId, status: 'ACTIVE' }
  });
  if (existingLoan) {
    throw httpError(409, 'Book already has an ACTIVE loan');
  }

  // If RESERVED, ensure reservation is for same user
  const activeReservation = await prisma.reservation.findFirst({
    where: { bookId, status: 'ACTIVE' }
  });

  if (book.status === 'RESERVED') {
    if (!activeReservation || activeReservation.userId !== userId) {
      throw httpError(409, 'Book is reserved for a different user');
    }
  } else if (book.status === 'LOANED') {
    throw httpError(409, 'Book is already LOANED');
  } else if (book.status === 'AVAILABLE' && activeReservation) {
    // safety: should not allow bypassing reservation queue
    throw httpError(409, 'Book has an ACTIVE reservation');
  }

  const loan = await prisma.loan.create({
    data: {
      userId,
      bookId,
      startDate: new Date(startDate),
      dueDate: new Date(dueDate),
      status: 'ACTIVE'
    }
  });

  // If there was an ACTIVE reservation for this user, mark it fulfilled
  if (activeReservation && activeReservation.userId === userId) {
    await prisma.reservation.update({
      where: { id: activeReservation.id },
      data: {
        status: 'FULFILLED',
        fulfilledAt: new Date()
      }
    });
  }

  await prisma.book.update({
    where: { id: bookId },
    data: { status: 'LOANED' }
  });

  return loan;
}

// Admin/librarian: all; users: own only
export async function listLoansForUser(user) {
  if (user.role === 'ADMIN' || user.role === 'LIBRARIAN') {
    return prisma.loan.findMany();
  }
  return prisma.loan.findMany({ where: { userId: user.id } });
}

export async function getLoanForUser(user, idParam) {
  const id = parseId(idParam, 'loan id');

  const loan = await prisma.loan.findUnique({ where: { id } });
  if (!loan) throw httpError(404, 'Loan not found');

  if (
    user.role !== 'ADMIN' &&
    user.role !== 'LIBRARIAN' &&
    loan.userId !== user.id
  ) {
    throw httpError(403, 'Forbidden');
  }

  return loan;
}

export async function returnLoan(idParam) {
  const id = parseId(idParam, 'loan id');

  const loan = await prisma.loan.findUnique({ where: { id } });
  if (!loan) throw httpError(404, 'Loan not found');

  if (loan.status !== 'ACTIVE' && loan.status !== 'OVERDUE') {
    throw httpError(400, 'Only ACTIVE or OVERDUE loans can be returned');
  }

  const updatedLoan = await prisma.loan.update({
    where: { id },
    data: {
      status: 'CLOSED',
      returnDate: new Date()
    }
  });

  // Check for ACTIVE reservation on this book
  const activeReservation = await prisma.reservation.findFirst({
    where: { bookId: loan.bookId, status: 'ACTIVE' }
  });

  if (activeReservation) {
    await prisma.book.update({
      where: { id: loan.bookId },
      data: { status: 'RESERVED' }
    });
  } else {
    await prisma.book.update({
      where: { id: loan.bookId },
      data: { status: 'AVAILABLE' }
    });
  }

  return updatedLoan;
}
