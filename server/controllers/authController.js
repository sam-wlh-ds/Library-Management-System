import { body, validationResult } from "express-validator";
import { createUser, verifyUser, updatePassword } from "../db/authDB.js";
import passport from "passport";
import JWT from "../utils/jwt.js";

const authValidate = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Email Format"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters")
    .isStrongPassword()
    .withMessage("Password not strong enough"),
];

const authController = {};

authController.signupRoutePOST = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  ...authValidate,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      const msg = await createUser({ name, email, password });
      res.status(200).json(msg).end();
    } catch (error) {
      next(error);
    }
  },
];

authController.loginRoutePOST = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Email Format"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }
    try {
      const { email, password } = req.body;
      const user = await verifyUser({ email, password });
      
      const token = await JWT.generateJwtToken(user);
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(401).json({ error: error.message || "Invalid credentials" });
    }
  },
];

authController.updatePasswordRoutePOST = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Email Format"),
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old password is required"),
  body("newPassword")
    .trim()
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .isStrongPassword()
    .withMessage("New password is not strong enough"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, oldPassword, newPassword } = req.body;

    try {
      const msg = await updatePassword({ email, oldPassword, newPassword });
      res.status(200).json(msg).end();
    } catch (error) {
      next(error);
    }
  },
];

export default authController;