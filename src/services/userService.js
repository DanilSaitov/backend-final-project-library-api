import prisma from '../db/prisma.js';

function httpError(status, message, details) {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
}

export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true, role: true, createdAt: true, updatedAt: true }
  });

  if (!user) throw httpError(404, 'User not found');
  return user;
}

export async function getAllUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, fullName: true, role: true, createdAt: true, updatedAt: true }
  });
}

export async function updateMyProfile(userId, data) {
  const { fullName } = data;
  if (!fullName) throw httpError(400, 'fullName is required');

  return prisma.user.update({
    where: { id: userId },
    data: { fullName },
    select: { id: true, email: true, fullName: true, role: true }
  });
}

export async function updateUserRole(userId, role) {
  const validRoles = ['USER', 'LIBRARIAN', 'ADMIN'];
  if (!validRoles.includes(role)) {
    throw httpError(400, 'Invalid role');
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, fullName: true, role: true }
  });

  return user;
}
