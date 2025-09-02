import React, { useContext } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
} from "@mui/material";
import { AuthContext } from "../lib/AuthContext";
import useApi from "../api/useApi";

const BookCard = ({ book, loan, onUpdate }) => {
    const { user, setSnackbar } = useContext(AuthContext);
    const api = useApi();

    const isBorrowed = loan;
    const isAvailable = book?.availability;
    const isLoanOverdue = isBorrowed && new Date(loan.dueDate) < new Date();

    const handleBorrow = async () => {
        const response = await api.post("/api/users/borrow", {
            userId: user._id,
            bookId: book._id,
        });
        if (response) {
            setSnackbar({
                open: true,
                message: "Book borrowed successfully!",
                severity: "success",
            });
            onUpdate();
        }
    };

    const handleReserve = async () => {
        const response = await api.post("/api/users/reserve", {
            userId: user._id,
            bookId: book._id,
        });
        if (response) {
            setSnackbar({
                open: true,
                message: "Book reserved successfully!",
                severity: "success",
            });
            onUpdate();
        }
    };

    const handleReturn = async () => {
        const bookId = loan.book._id || loan.book;
        const response = await api.post("/api/users/return", {
            userId: user._id,
            bookId: bookId,
        });
        if (response) {
            setSnackbar({
                open: true,
                message: "Book returned successfully!",
                severity: "success",
            });
            onUpdate();
        }
    };

    const handleRenew = async () => {
        const bookId = loan.book._id || loan.book;
        const response = await api.post("/api/users/renew", {
            userId: user._id,
            bookId: bookId,
        });
        if (response) {
            setSnackbar({
                open: true,
                message: "Book renewed successfully!",
                severity: "success",
            });
            onUpdate();
        }
    };

    const handleRead = () => {
        window.open(book.bookFile, "_blank");
    };

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">
                    {book?.title || "Unknown Title"}
                </Typography>
                <Typography color="text.secondary">
                    by {book?.author || "Unknown Author"}
                </Typography>
                <Typography color="text.secondary">
                    Category: {book?.category}
                </Typography>
                {isBorrowed && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Due: {new Date(loan.dueDate).toLocaleDateString()}
                        </Typography>
                        {isLoanOverdue && (
                            <Typography variant="body2" color="error">
                                Overdue!
                            </Typography>
                        )}
                    </Box>
                )}
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                {book?.bookFile && (
                    <Button size="small" variant="text" onClick={handleRead}>
                        Read
                    </Button>
                )}
                {user && isAvailable && (
                    <Button
                        size="small"
                        variant="contained"
                        onClick={handleBorrow}
                    >
                        Borrow
                    </Button>
                )}
                {user && !isAvailable && !isBorrowed && (
                    <Button
                        size="small"
                        variant="contained"
                        onClick={handleReserve}
                    >
                        Reserve
                    </Button>
                )}
                {user && isBorrowed && (
                    <>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={handleReturn}
                        >
                            Return
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={handleRenew}
                        >
                            Renew
                        </Button>
                    </>
                )}
            </CardActions>
        </Card>
    );
};

export default BookCard;
