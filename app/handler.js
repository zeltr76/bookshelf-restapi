const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const isThisFinished = (pageCount, readPage) => {
    if (pageCount === readPage) {
      return true
    } else {
      return false
    }
  }

  const finished = isThisFinished(pageCount, readPage)

  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  if (name) {
    const lowCase = name.toLowerCase()

    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.name.toLowerCase().includes(lowCase))
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
      }
    })
    response.code(200)
    return response
  }

  if (reading === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((r) => r.reading === true)
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
      }
    })
    response.code(200)
    return response
  } else if (reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((r) => r.reading === false)
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
      }
    })
    response.code(200)
    return response
  }

  if (finished === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((f) => f.finished === true)
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
      }
    })
    response.code(200)
    return response
  } else if (finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((f) => f.finished === false)
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
      }
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher
      }))
    }
  })
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((n) => n.id === bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
