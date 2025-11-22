import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  handleGetMe,
  handleGetUsers,
  handleUpdateMe,
  handleUpdateRole
} from '../controllers/userController.js';

export const userRoutes = express.Router();

// Authenticated user
userRoutes.get('/me', auth, handleGetMe);
userRoutes.patch('/me', auth, handleUpdateMe);

// Librarian/Admin list users
userRoutes.get('/', auth, requireRole('LIBRARIAN', 'ADMIN'), handleGetUsers);

// Admin updates roles
userRoutes.patch('/:id/role', auth, requireRole('ADMIN'), handleUpdateRole);
