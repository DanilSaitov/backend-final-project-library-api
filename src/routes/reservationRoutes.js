import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  handleCreateReservation,
  handleListReservations,
  handleGetReservation,
  handleCancelReservation,
  handleFulfillReservation
} from '../controllers/reservationController.js';

export const reservationRoutes = express.Router();

// Authenticated
reservationRoutes.post('/', auth, handleCreateReservation);
reservationRoutes.get('/', auth, handleListReservations);
reservationRoutes.get('/:id', auth, handleGetReservation);
reservationRoutes.delete('/:id', auth, handleCancelReservation);

// Librarian/Admin only
reservationRoutes.post(
  '/:id/fulfill',
  auth,
  requireRole('LIBRARIAN', 'ADMIN'),
  handleFulfillReservation
);
