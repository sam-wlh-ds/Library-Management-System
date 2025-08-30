import { Router } from 'express';
import JWT from '../utils/jwt.js';
import booksController from '../controllers/booksController.js';

const booksRouter = Router();

// GET /api/books/browse
booksRouter.get('/browse', booksController.browseBooks);

// GET /api/books/search?title=...&author=...&category=...&availability=...&reservedBy=...
booksRouter.get('/search', booksController.searchBook);

// GET /api/books/read/:bookId
booksRouter.get('/read/:bookId', booksController.readBook);

// POST /api/books/add
booksRouter.post('/add', JWT.verifyJwtToken, booksController.addBook);

export default booksRouter; 