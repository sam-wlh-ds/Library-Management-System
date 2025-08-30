import { borrowBook, returnBook, reserveBook, getUserById, renewBook } from '../db/queryDB.js';

const usersController = {};

usersController.getDashboard = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

usersController.borrowBook = async (req, res, next) => {
  const { userId, bookId } = req.body;
  try {
    const loan = await borrowBook(userId, bookId);
    res.status(200).json(loan);
  } catch (error) {
    next(error);
  }
};

usersController.returnBook = async (req, res, next) => {
  const { userId, bookId } = req.body;
  try {
    const returnedBook = await returnBook(userId, bookId);
    res.status(200).json(returnedBook);
  } catch (error) {
    next(error);
  }
};

usersController.reserveBook = async (req, res, next) => {
  const { userId, bookId } = req.body;
  try {
    const reservation = await reserveBook(userId, bookId);
    res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
};

usersController.renewBook = async (req, res, next) => {
  const { userId, bookId } = req.body;
  try {
    const result = await renewBook(userId, bookId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default usersController;