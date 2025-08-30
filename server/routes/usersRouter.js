import { Router } from "express";
import usersController from "../controllers/usersController.js";
import { updatePassword } from "../db/authDB.js";

const usersRouter = Router();

// GET /api/users/:id/dashboard
usersRouter.get("/:id/dashboard", usersController.getDashboard);

// POST /api/users/borrow
usersRouter.post("/borrow", usersController.borrowBook);

// POST /api/users/return
usersRouter.post("/return", usersController.returnBook);

// POST /api/users/reserve
usersRouter.post("/reserve", usersController.reserveBook);

// POST /api/users/renew
usersRouter.post('/renew', usersController.renewBook);

// PATCH /api/users/:id/password
usersRouter.patch("/:id/password", async (req, res, next) => {
    const { email, oldPassword, newPassword } = req.body;
    try {
        const result = await updatePassword({
            email,
            oldPassword,
            newPassword,
        });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export default usersRouter;
