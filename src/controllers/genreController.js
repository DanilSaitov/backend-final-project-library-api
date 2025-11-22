import {
  listGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
} from '../services/genreService.js';

export async function handleListGenres(req, res, next) {
  try {
    const genres = await listGenres();
    res.json(genres);
  } catch (err) {
    next(err);
  }
}

export async function handleGetGenre(req, res, next) {
  try {
    const genre = await getGenreById(req.params.id);
    res.json(genre);
  } catch (err) {
    next(err);
  }
}

export async function handleCreateGenre(req, res, next) {
  try {
    const genre = await createGenre(req.body);
    res.status(201).json(genre);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateGenre(req, res, next) {
  try {
    const genre = await updateGenre(req.params.id, req.body);
    res.json(genre);
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteGenre(req, res, next) {
  try {
    await deleteGenre(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
