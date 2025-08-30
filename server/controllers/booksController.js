import { getAvailableBooks, searchBooks, getBookById } from '../db/queryDB.js';
import { BookModel } from "../models/index.js";

const booksController = {};

booksController.addBook = async (req, res, next) => {
  try {
    const { title, author, category, shelves, availability, bookFile } = req.body;

    const newBook = new BookModel({
      title,
      author,
      category,
      shelves,
      availability,
      bookFile
    });

    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    next(error);
  }
};

booksController.browseBooks = async (req, res, next) => {
  try {
    const books = await getAvailableBooks();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

booksController.searchBook = async (req, res, next) => {
  try {
    const { title, author, category, availability, reservedBy } = req.query;
    const filter = {};

    if (title) {
      filter.title = new RegExp(title, 'i');
    }
    if (author) {
      filter.author = new RegExp(author, 'i');
    }
    if (category) {
      filter.category = new RegExp(category, 'i');
    }
    if (availability) {
      filter.availability = availability === 'true';
    }
    if (reservedBy) {
      filter.reservedBy = { $size: parseInt(reservedBy) };
    }

    const books = await searchBooks(filter);
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

booksController.readBook = async (req, res, next) => {
  const { bookId } = req.params;
  try {
    const book = await getBookById(bookId);
    if (!book || !book.bookFile) {
      return res.status(404).json({ error: 'Book not found or file not available.' });
    }
    res.redirect(book.bookFile);
  } catch (error) {
    next(error);
  }
};

export default booksController;