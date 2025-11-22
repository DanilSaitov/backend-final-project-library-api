import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';

function httpError(status, message, details) {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
}

export async function registerUser({ fullName, email, password }) {
  if (!fullName || !email || !password) {
    throw httpError(400, 'fullName, email, and password are required');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw httpError(409, 'Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: 'USER'
    }
  });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role
  };
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw httpError(400, 'email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw httpError(401, 'Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw httpError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  };
}