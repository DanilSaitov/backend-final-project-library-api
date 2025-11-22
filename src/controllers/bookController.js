import {
  listBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../services/bookService.js';

export async function handleListBooks(req, res, next) {
  try {
    const books = await listBooks(req.query);
    res.json(books);
  } catch (err) {
    next(err);
  }
}

export async function handleGetBook(req, res, next) {
  try {
    const book = await getBookById(req.params.id);
    res.json(book);
  } catch (err) {
    next(err);
  }
}

export async function handleCreateBook(req, res, next) {
  try {
    const book = await createBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateBook(req, res, next) {
  try {
    const book = await updateBook(req.params.id, req.body);
    res.json(book);
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteBook(req, res, next) {
  try {
    await deleteBook(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
