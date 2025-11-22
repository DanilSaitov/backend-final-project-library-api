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

export async function listAuthors() {
  return prisma.author.findMany();
}

export async function getAuthorById(idParam) {
  const id = parseId(idParam, 'author id');
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) throw httpError(404, 'Author not found');
  return author;
}

export async function createAuthor(data) {
  const { name } = data;
  if (!name) throw httpError(400, 'name is required');
  return prisma.author.create({ data: { name } });
}

export async function updateAuthor(idParam, data) {
  const id = parseId(idParam, 'author id');
  return prisma.author.update({ where: { id }, data });
}

export async function deleteAuthor(idParam) {
  const id = parseId(idParam, 'author id');

  const booksCount = await prisma.book.count({ where: { authorId: id } });
  if (booksCount > 0) {
    throw httpError(400, 'Cannot delete author with associated books');
  }

  await prisma.author.delete({ where: { id } });
}
