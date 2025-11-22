import {
  listAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../services/authorService.js';

export async function handleListAuthors(req, res, next) {
  try {
    const authors = await listAuthors();
    res.json(authors);
  } catch (err) {
    next(err);
  }
}

export async function handleGetAuthor(req, res, next) {
  try {
    const author = await getAuthorById(req.params.id);
    res.json(author);
  } catch (err) {
    next(err);
  }
}

export async function handleCreateAuthor(req, res, next) {
  try {
    const author = await createAuthor(req.body);
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateAuthor(req, res, next) {
  try {
    const author = await updateAuthor(req.params.id, req.body);
    res.json(author);
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteAuthor(req, res, next) {
  try {
    await deleteAuthor(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
