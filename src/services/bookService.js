import prisma from '../db/prisma.js';

function httpError(status, message, details) {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
}

function parseId(param, name = 'id') {
  const id = Number.parseInt(param, 10);
  if (Number.isNaN(id)) {
    throw httpError(400, `Invalid ${name}`);
  }
  return id;
}

export async function listBooks(query) {
  const where = {};
  if (query.status) {
    where.status = query.status;
  }
  if (query.q) {
    where.title = { contains: query.q, mode: 'insensitive' };
  }

  return prisma.book.findMany({
    where,
    include: { author: true, genre: true }
  });
}

export async function getBookById(idParam) {
  const id = parseId(idParam, 'book id');
  const book = await prisma.book.findUnique({
    where: { id },
    include: { author: true, genre: true }
  });
  if (!book) throw httpError(404, 'Book not found', ['Book not found']);
  return book;
}

export async function createBook(data) {
  const { isbn13, title, publicationYear, pageCount, authorId, genreId } = data;
  if (!isbn13 || !title || !publicationYear || !pageCount || !authorId || !genreId) {
    throw httpError(400, 'Missing required fields for book creation');
  }

  return prisma.book.create({
    data: {
      isbn13,
      title,
      publicationYear,
      pageCount,
      authorId,
      genreId
    }
  });
}

export async function updateBook(idParam, data) {
  const id = parseId(idParam, 'book id');
  return prisma.book.update({
    where: { id },
    data
  });
}

export async function deleteBook(idParam) {
  const id = parseId(idParam, 'book id');
  await prisma.book.delete({ where: { id } });
}
