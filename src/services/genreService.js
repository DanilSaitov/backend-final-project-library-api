import prisma from '../db/prisma.js';

function httpError(status, message, details) {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
}

function parseId(param, name = 'id') {
  const id = Number.parseInt(param, 10);
  if (Number.isNaN(id)) throw httpError(400, `Invalid ${name}`);
  return id;
}

export async function listGenres() {
  return prisma.genre.findMany();
}

export async function getGenreById(idParam) {
  const id = parseId(idParam, 'genre id');
  const genre = await prisma.genre.findUnique({ where: { id } });
  if (!genre) throw httpError(404, 'Genre not found');
  return genre;
}

export async function createGenre(data) {
  const { name } = data;
  if (!name) throw httpError(400, 'name is required');
  return prisma.genre.create({ data: { name } });
}

export async function updateGenre(idParam, data) {
  const id = parseId(idParam, 'genre id');
  return prisma.genre.update({ where: { id }, data });
}

export async function deleteGenre(idParam) {
  const id = parseId(idParam, 'genre id');

  const booksCount = await prisma.book.count({ where: { genreId: id } });
  if (booksCount > 0) {
    throw httpError(400, 'Cannot delete genre with associated books');
  }

  await prisma.genre.delete({ where: { id } });
}
