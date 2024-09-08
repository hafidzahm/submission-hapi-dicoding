const { nanoid } = require('nanoid');
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const finished = pageCount === readPage;

    const newBook = {

    }

}

module.exports = { addBookHandler }