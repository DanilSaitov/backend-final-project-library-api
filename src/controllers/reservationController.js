import {
  createReservation,
  listReservationsForUser,
  getReservationForUser,
  cancelReservation,
  fulfillReservation
} from '../services/reservationService.js';

export async function handleCreateReservation(req, res, next) {
  try {
    const reservation = await createReservation(req.user.id, req.body);
    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
}

export async function handleListReservations(req, res, next) {
  try {
    const reservations = await listReservationsForUser(req.user);
    res.json(reservations);
  } catch (err) {
    next(err);
  }
}

export async function handleGetReservation(req, res, next) {
  try {
    const reservation = await getReservationForUser(req.user, req.params.id);
    res.json(reservation);
  } catch (err) {
    next(err);
  }
}

export async function handleCancelReservation(req, res, next) {
  try {
    const reservation = await cancelReservation(req.user, req.params.id);
    res.json(reservation);
  } catch (err) {
    next(err);
  }
}

export async function handleFulfillReservation(req, res, next) {
  try {
    const result = await fulfillReservation(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
