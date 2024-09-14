/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;


  const nullName = name == undefined;
  const errorCount = readPage > pageCount;
  const finished = pageCount === readPage;

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


  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  books.push(newBook);
  const bookSuccess = books.filter((book) => book.id === id).length > 0;

  if (bookSuccess) {
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


};

const getAllBooksHandler = (request, h) => {
  const bookVariabel = books;
  const formatBook = bookVariabel.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }));
  console.log(formatBook);

  const response = h.response({
    status: 'success',
    data: {
      books: formatBook,
    }
  });
  response.code(200);
  return response;



};


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

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  const bookIndex = books.findIndex((book) => book.id === id);
  const bookIndexer = bookIndex !== -1;
  const nullName = name == null;
  const errorCount = readPage >= pageCount;

  if (nullName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (errorCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }
  if (bookIndexer) {
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;

};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const bookIndex = books.findIndex((book) => book.id === id);
  const indexNotMinus = bookIndex !== -1;

  if (indexNotMinus) {
    books.splice(bookIndex, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };