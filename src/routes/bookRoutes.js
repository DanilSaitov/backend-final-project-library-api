import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  handleListBooks,
  handleGetBook,
  handleCreateBook,
  handleUpdateBook,
  handleDeleteBook
} from '../controllers/bookController.js';

export const bookRoutes = express.Router();

// Public read
bookRoutes.get('/', handleListBooks);
bookRoutes.get('/:id', handleGetBook);

// Librarian/Admin modify catalog
bookRoutes.post('/', auth, requireRole('LIBRARIAN', 'ADMIN'), handleCreateBook);
bookRoutes.patch('/:id', auth, requireRole('LIBRARIAN', 'ADMIN'), handleUpdateBook);
bookRoutes.delete('/:id', auth, requireRole('LIBRARIAN', 'ADMIN'), handleDeleteBook);
