import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  handleCreateLoan,
  handleListLoans,
  handleGetLoan,
  handleReturnLoan
} from '../controllers/loanController.js';

export const loanRoutes = express.Router();

// Librarian/Admin create loans and process returns
loanRoutes.post('/', auth, requireRole('LIBRARIAN', 'ADMIN'), handleCreateLoan);
loanRoutes.post('/:id/return', auth, requireRole('LIBRARIAN', 'ADMIN'), handleReturnLoan);

// Authenticated users/admins can view loans
loanRoutes.get('/', auth, handleListLoans);
loanRoutes.get('/:id', auth, handleGetLoan);
