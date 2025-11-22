import { getMe, getAllUsers, updateMyProfile, updateUserRole } from '../services/userService.js';

export async function handleGetMe(req, res, next) {
  try {
    const user = await getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function handleGetUsers(req, res, next) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateMe(req, res, next) {
  try {
    const user = await updateMyProfile(req.user.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateRole(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await updateUserRole(id, req.body.role);
    res.json(user);
  } catch (err) {
    next(err);
  }
}