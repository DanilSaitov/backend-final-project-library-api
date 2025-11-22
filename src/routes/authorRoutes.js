import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  handleListAuthors,
  handleGetAuthor,
  handleCreateAuthor,
  handleUpdateAuthor,
  handleDeleteAuthor
} from '../controllers/authorController.js';

export const authorRoutes = express.Router();

// Public read
authorRoutes.get('/', handleListAuthors);
authorRoutes.get('/:id', handleGetAuthor);

// Librarian/Admin modify
authorRoutes.post('/', auth, requireRole('LIBRARIAN', 'ADMIN'), handleCreateAuthor);
authorRoutes.patch('/:id', auth, requireRole('LIBRARIAN', 'ADMIN'), handleUpdateAuthor);
authorRoutes.delete('/:id', auth, requireRole('LIBRARIAN', 'ADMIN'), handleDeleteAuthor);
