import prisma from '../src/db/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  
  console.log('Clearing existing data...');
  await prisma.$queryRaw`TRUNCATE users, authors, genres, books, reservations, loans RESTART IDENTITY CASCADE;`;

  
  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('Creating users...');
  
  await prisma.user.create({
    data: {
      email: 'admin@library.com',
      passwordHash: hashedPassword,
      fullName: 'Library Administrator',
      role: 'ADMIN'
    }
  });

  
  await prisma.user.create({
    data: {
      email: 'librarian@library.com',
      passwordHash: hashedPassword,
      fullName: 'John Librarian',
      role: 'LIBRARIAN'
    }
  });

  // Create Regular users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      passwordHash: hashedPassword,
      fullName: 'Alice Johnson',
      role: 'USER'
    }
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      passwordHash: hashedPassword,
      fullName: 'Bob Smith',
      role: 'USER'
    }
  });

  const charlie = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      passwordHash: hashedPassword,
      fullName: 'Charlie Brown',
      role: 'USER'
    }
  });

  console.log('Creating genres...');
  
  await prisma.genre.createMany({
    data: [
      { name: 'Fantasy' },
      { name: 'Science Fiction' },
      { name: 'Mystery' },
      { name: 'Romance' },
      { name: 'Biography' },
      { name: 'History' },
      { name: 'Non-Fiction' },
      { name: 'Classic Literature' }
    ]
  });

  console.log('Creating authors...');
 
  await prisma.author.createMany({
    data: [
      { name: 'J.K. Rowling' },
      { name: 'George R.R. Martin' },
      { name: 'Agatha Christie' },
      { name: 'Isaac Asimov' },
      { name: 'Jane Austen' },
      { name: 'Stephen King' },
      { name: 'J.R.R. Tolkien' },
      { name: 'Harper Lee' },
      { name: 'George Orwell' },
      { name: 'F. Scott Fitzgerald' }
    ]
  });

  
  const fantasy = await prisma.genre.findUnique({ where: { name: 'Fantasy' } });
  const sciFi = await prisma.genre.findUnique({ where: { name: 'Science Fiction' } });
  const mystery = await prisma.genre.findUnique({ where: { name: 'Mystery' } });
  const classic = await prisma.genre.findUnique({ where: { name: 'Classic Literature' } });

  const rowling = await prisma.author.findFirst({ where: { name: 'J.K. Rowling' } });
  const martin = await prisma.author.findFirst({ where: { name: 'George R.R. Martin' } });
  const christie = await prisma.author.findFirst({ where: { name: 'Agatha Christie' } });
  const asimov = await prisma.author.findFirst({ where: { name: 'Isaac Asimov' } });
  const austen = await prisma.author.findFirst({ where: { name: 'Jane Austen' } });
  const king = await prisma.author.findFirst({ where: { name: 'Stephen King' } });
  const tolkien = await prisma.author.findFirst({ where: { name: 'J.R.R. Tolkien' } });
  const lee = await prisma.author.findFirst({ where: { name: 'Harper Lee' } });
  const orwell = await prisma.author.findFirst({ where: { name: 'George Orwell' } });
  const fitzgerald = await prisma.author.findFirst({ where: { name: 'F. Scott Fitzgerald' } });

  console.log('Creating books...');
  
  const book1 = await prisma.book.create({
    data: {
      isbn13: '9780439708180',
      title: 'Harry Potter and the Sorcerer\'s Stone',
      publicationYear: 1997,
      pageCount: 309,
      status: 'AVAILABLE',
      authorId: rowling.id,
      genreId: fantasy.id
    }
  });

  const book2 = await prisma.book.create({
    data: {
      isbn13: '9780439064873',
      title: 'Harry Potter and the Chamber of Secrets',
      publicationYear: 1998,
      pageCount: 341,
      status: 'AVAILABLE',
      authorId: rowling.id,
      genreId: fantasy.id
    }
  });

  const book3 = await prisma.book.create({
    data: {
      isbn13: '9780553103540',
      title: 'A Game of Thrones',
      publicationYear: 1996,
      pageCount: 694,
      status: 'AVAILABLE',
      authorId: martin.id,
      genreId: fantasy.id
    }
  });

  const book4 = await prisma.book.create({
    data: {
      isbn13: '9780544003415',
      title: 'The Lord of the Rings',
      publicationYear: 1954,
      pageCount: 1178,
      status: 'AVAILABLE',
      authorId: tolkien.id,
      genreId: fantasy.id
    }
  });

  const book5 = await prisma.book.create({
    data: {
      isbn13: '9780062073488',
      title: 'And Then There Were None',
      publicationYear: 1939,
      pageCount: 264,
      status: 'RESERVED',
      authorId: christie.id,
      genreId: mystery.id
    }
  });

  const book6 = await prisma.book.create({
    data: {
      isbn13: '9780062074027',
      title: 'Murder on the Orient Express',
      publicationYear: 1934,
      pageCount: 256,
      status: 'AVAILABLE',
      authorId: christie.id,
      genreId: mystery.id
    }
  });

  const book7 = await prisma.book.create({
    data: {
      isbn13: '9780553293357',
      title: 'Foundation',
      publicationYear: 1951,
      pageCount: 244,
      status: 'LOANED',
      authorId: asimov.id,
      genreId: sciFi.id
    }
  });

  const book8 = await prisma.book.create({
    data: {
      isbn13: '9780141439518',
      title: 'Pride and Prejudice',
      publicationYear: 1813,
      pageCount: 432,
      status: 'AVAILABLE',
      authorId: austen.id,
      genreId: classic.id
    }
  });

  const book9 = await prisma.book.create({
    data: {
      isbn13: '9780446310789',
      title: 'To Kill a Mockingbird',
      publicationYear: 1960,
      pageCount: 376,
      status: 'AVAILABLE',
      authorId: lee.id,
      genreId: classic.id
    }
  });

  const book10 = await prisma.book.create({
    data: {
      isbn13: '9780452284234',
      title: '1984',
      publicationYear: 1949,
      pageCount: 328,
      status: 'AVAILABLE',
      authorId: orwell.id,
      genreId: sciFi.id
    }
  });

  const book11 = await prisma.book.create({
    data: {
      isbn13: '9780743273565',
      title: 'The Great Gatsby',
      publicationYear: 1925,
      pageCount: 180,
      status: 'AVAILABLE',
      authorId: fitzgerald.id,
      genreId: classic.id
    }
  });

  const book12 = await prisma.book.create({
    data: {
      isbn13: '9780307743657',
      title: 'The Shining',
      publicationYear: 1977,
      pageCount: 447,
      status: 'AVAILABLE',
      authorId: king.id,
      genreId: mystery.id
    }
  });

  console.log('Creating reservations...');
  
  await prisma.reservation.createMany({
    data: [
      {
        userId: alice.id,
        bookId: book5.id, 
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
      },
      {
        userId: bob.id,
        bookId: book12.id, 
        status: 'EXPIRED',
        expiresAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) 
      },
      {
        userId: charlie.id,
        bookId: book8.id, 
        status: 'CANCELLED',
        cancelledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) 
      }
    ]
  });

  console.log('Creating loans...');
  await prisma.loan.createMany({
    data: [
      {
        userId: alice.id,
        bookId: book7.id, 
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), 
        status: 'ACTIVE'
      },
      {
        userId: bob.id,
        bookId: book1.id, 
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), 
        dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),   
        status: 'OVERDUE'
      },
      {
        userId: charlie.id,
        bookId: book10.id, // "1984"
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
        dueDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),   
        returnDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 
        status: 'CLOSED'
      }
    ]
  });

  console.log('Database seeded successfully!');
  console.log('\nSummary:');
  console.log('5 users created (1 Admin, 1 Librarian, 3 Regular Users)');
  console.log('8 genres created');
  console.log('10 authors created');
  console.log('12 books created');
  console.log('3 reservations created');
  console.log('3 loans created');
  console.log('\nTest Credentials (password: password123):');
  console.log('- admin@library.com (ADMIN)');
  console.log('- librarian@library.com (LIBRARIAN)');
  console.log('- alice@example.com (USER) - has active reservation & loan');
  console.log('- bob@example.com (USER) - has expired reservation & overdue loan');
  console.log('- charlie@example.com (USER) - has cancelled reservation & closed loan');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
