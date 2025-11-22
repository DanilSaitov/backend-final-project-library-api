import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  handleListGenres,
  handleGetGenre,
  handleCreateGenre,
  handleUpdateGenre,
  handleDeleteGenre
} from '../controllers/genreController.js';

export const genreRoutes = express.Router();

// Public read
genreRoutes.get('/', handleListGenres);
genreRoutes.get('/:id', handleGetGenre);

// Librarian/Admin modify
genreRoutes.post('/', auth, requireRole('LIBRARIAN', 'ADMIN'), handleCreateGenre);
genreRoutes.patch('/:id', auth, requireRole('LIBRARIAN', 'ADMIN'), handleUpdateGenre);
genreRoutes.delete('/:id', auth, requireRole('LIBRARIAN', 'ADMIN'), handleDeleteGenre);
