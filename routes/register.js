import { Router } from "express";
import authController from "../controllers/authController.js";

const registerRouter = Router();

registerRouter.post('/', authController.signupRoutePOST);

export default registerRouter;