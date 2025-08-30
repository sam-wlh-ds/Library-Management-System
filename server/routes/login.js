import { Router } from "express";
import authController from "../controllers/authController.js";

const loginRouter = Router();

loginRouter.post("/", authController.loginRoutePOST);

export default loginRouter;