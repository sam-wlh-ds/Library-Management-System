import mongoose from "mongoose";
import {
    UserModel,
    BookModel,
    LoanModel,
    ReservationModel,
} from "../models/index.js";

const deadline = 14 * 24 * 60 * 60 * 1000; // 14 days
const renewdeadline = deadline;
const finePerDayInRs = 10;

async function getUserById(id) {
    try {
        const user = await UserModel.findById(id)
            .populate("borrowedBooks.book")
            .populate("reservations.book");
        if (!user) {
            throw new Error("User not found" + id);
        }
        return user;
    } catch (error) {
        throw new Error(error.message || "Failed to fetch user");
    }
}

async function getBookById(id) {
    try {
        const book = await BookModel.findById(id);
        if (!book) {
            throw new Error("Book not found");
        }
        return book;
    } catch (error) {
        throw new Error(error.message || "Failed to fetch book by ID");
    }
}

async function searchBooks(filter) {
    try {
        const books = await BookModel.find(filter);
        return books;
    } catch (error) {
        throw new Error(error.message || "Failed to search for books");
    }
}

async function getAvailableBooks() {
    try {
        const availableBooks = await BookModel.find({ availability: true });
        return availableBooks;
    } catch (error) {
        throw new Error(error.message || "Failed to fetch available books");
    }
}

async function borrowBook(userId, bookId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await UserModel.findById(userId).session(session);
        const book = await BookModel.findById(bookId).session(session);
        if (!user) {
            throw new Error("User not found ");
        } else if (!book) {
            throw new Error("Book not found");
        } else if (!book.availability) {
            throw new Error("Book is not available.");
        }

        book.availability = false;
        book.borrowedBy = userId;
        await book.save({ session });

        const newLoan = new LoanModel({
            user: userId,
            book: bookId,
            dueDate: new Date(Date.now() + deadline),
        });
        await newLoan.save({ session });

        user.borrowedBooks.push({
            book: bookId,
            borrowDate: newLoan.borrowDate,
            dueDate: newLoan.dueDate,
        });
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        return newLoan;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message || "Failed to borrow book.");
    }
}

async function returnBook(userId, bookId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await UserModel.findById(userId).session(session);
        const book = await BookModel.findById(bookId).session(session);
        const loan = await LoanModel.findOne({
            user: userId,
            book: bookId,
            status: "borrowed",
        }).session(session);

        if (!user) {
            throw new Error("Invalid user");
        } else if (!book) {
            throw new Error("Invalid book");
        } else if (!loan) {
            throw new Error("No active loan found");
        }

        const returnDate = new Date();
        loan.returnDate = returnDate;
        loan.status = "returned";

        // Calculate fines if overdue
        const dueDate = new Date(loan.dueDate);
        let fineAmount = 0;
        if (returnDate > dueDate) {
            const overdueDays = Math.ceil(
                (returnDate - dueDate) / (1000 * 60 * 60 * 24)
            );
            fineAmount = overdueDays * finePerDayInRs;
        }
        loan.fines = fineAmount;
        await loan.save({ session });

        book.availability = true;
        book.borrowedBy = null;
        await book.save({ session });

        if (fineAmount > 0) {
            user.finesHistory.push({
                amount: fineAmount,
                reason: `Overdue book: ${book.title}`,
                dateIssued: new Date(),
            });
        }

        user.borrowedBooks = user.borrowedBooks.filter(
            (borrowed) => borrowed.book.toString() !== bookId
        );
        await user.save({ session });

        if (book.reservedBy.length > 0) {
            const nextUserId = book.reservedBy[0];

            book.reservedBy.shift();

            book.availability = false;
            book.borrowedBy = nextUserId;

            const nextUser = await UserModel.findById(nextUserId).session(
                session
            );
            const reservation = await ReservationModel.findOne({
                user: nextUserId,
                book: bookId,
            }).session(session);

            if (nextUser && reservation) {
                reservation.status = "fulfilled";
                await reservation.save({ session });

                nextUser.reservations = nextUser.reservations.filter(
                    (res) => res.book.toString() !== bookId
                );

                const newLoan = new LoanModel({
                    user: nextUserId,
                    book: bookId,
                    dueDate: new Date(Date.now() + deadline),
                });
                await newLoan.save({ session });

                nextUser.borrowedBooks.push({
                    book: bookId,
                    borrowDate: newLoan.borrowDate,
                    dueDate: newLoan.dueDate,
                });
                await nextUser.save({ session });
            }
        } else {
            book.availability = true;
            book.borrowedBy = null;
        }

        await book.save({ session });

        await session.commitTransaction();
        session.endSession();

        return loan;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message || "Failed to return book.");
    }
}

async function reserveBook(userId, bookId) {
    const book = await BookModel.findById(bookId);
    const user = await UserModel.findById(userId);

    const hasBorrowed = user.borrowedBooks.some(
        (loan) => loan.book.toString() === bookId
    );
    const hasReserved = book.reservedBy.some((id) => id.toString() === userId);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!user) {
            throw new Error("User not found.");
        }
        if (!book) {
            throw new Error("Book not found.");
        }
        if (book.availability) {
            throw new Error(
                "Book is currently available and cannot be reserved."
            );
        }
        if (hasBorrowed) {
            throw new Error("You have already borrowed this book.");
        }
        if (hasReserved) {
            throw new Error("You have already reserved this book.");
        }

        const newReservation = new ReservationModel({
            user: userId,
            book: bookId,
        });
        await newReservation.save({ session });

        book.reservedBy.push(userId);
        await book.save({ session });

        user.reservations.push({
            book: bookId,
            reservationDate: new Date(),
        });
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        return newReservation;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message || "Failed to reserve book.");
    }
}

async function renewBook(userId, bookId) {
    const user = await UserModel.findById(userId);
    const book = await BookModel.findById(bookId);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const loan = await LoanModel.findOne({
            user: userId,
            book: bookId,
            status: "borrowed",
        }).session(session);

        if (!user) {
            throw new Error("Invalid user");
        }
        if (!book) {
            throw new Error("Invalid Book");
        }
        if (!loan) {
            throw new Error("No active loan found.");
        }

        const today = new Date();
        const dueDate = new Date(loan.dueDate);

        const todayNormalized = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );
        const dueDateNormalized = new Date(
            dueDate.getFullYear(),
            dueDate.getMonth(),
            dueDate.getDate()
        );

        if (todayNormalized.getTime() !== dueDateNormalized.getTime()) {
            throw new Error("The book can only be renewed on its due date.");
        }

        if (book.reservedBy && book.reservedBy.length > 0) {
            throw new Error("This book is reserved and cannot be renewed.");
        }

        const newDueDate = new Date(Date.now() + renewdeadline);
        loan.dueDate = newDueDate;
        await loan.save({ session });

        // Update the user's borrowedBooks array with the new due date
        const borrowedBookIndex = user.borrowedBooks.findIndex(
            (borrowed) => borrowed.book.toString() === bookId
        );
        if (borrowedBookIndex !== -1) {
            user.borrowedBooks[borrowedBookIndex].dueDate = newDueDate;
            await user.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        return {
            message: "Book renewed successfully.",
            newDueDate: newDueDate,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message || "Failed to renew book.");
    }
}

export {
    getUserById,
    getBookById,
    searchBooks,
    getAvailableBooks,
    borrowBook,
    returnBook,
    reserveBook,
    renewBook,
};
