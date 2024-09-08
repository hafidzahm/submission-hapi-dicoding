/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  books.push(newBook);

  const bookSuccess = books.filter((book) => book.id === id).length > 0;
  const nullName = name == null;
  const errorCount = readPage >= pageCount;

  if (bookSuccess && !nullName && !errorCount) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  if (finished) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  if (nullName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;

  }

  if (errorCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
};

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books,
  },
});

const getBookByIdHandler = (request, h) => {
  const { id, readPage, pageCount } = request.params;
  const book = books.filter((b) => b.id === id)[0];
  const read = books.filter((b) => b.readPage === readPage);
  const page = books.filter((b) => b.pageCount === pageCount);
  const bookIdUndefined = book === undefined;
  const finished = read == page;
  if (!bookIdUndefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  if (finished) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  if (bookIdUndefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
  }


};
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler };