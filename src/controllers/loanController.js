import {
  createLoan,
  listLoansForUser,
  getLoanForUser,
  returnLoan
} from '../services/loanService.js';

export async function handleCreateLoan(req, res, next) {
  try {
    const loan = await createLoan(req.body);
    res.status(201).json(loan);
  } catch (err) {
    next(err);
  }
}

export async function handleListLoans(req, res, next) {
  try {
    const loans = await listLoansForUser(req.user);
    res.json(loans);
  } catch (err) {
    next(err);
  }
}

export async function handleGetLoan(req, res, next) {
  try {
    const loan = await getLoanForUser(req.user, req.params.id);
    res.json(loan);
  } catch (err) {
    next(err);
  }
}

export async function handleReturnLoan(req, res, next) {
  try {
    const loan = await returnLoan(req.params.id);
    res.json(loan);
  } catch (err) {
    next(err);
  }
}
