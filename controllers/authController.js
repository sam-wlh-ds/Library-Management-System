import { body, validationResult } from "express-validator";
import { createUser } from "../db/authDB.js";
import passport from "passport";
import JWT from "../utils/jwt.js";

const authLoginValidate = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username should 3 to 20 characters long")
    .isAlphanumeric()
    .withMessage("Username should not contain symbols"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password should be atleast 8 characters")
    .isStrongPassword()
    .withMessage("Password not strong enough"),
];

const authRegisterValidate = [
  body("email").trim().isEmail().withMessage("Invalid Email Format"),
];

const authController = {};

authController.signupRoutePOST = [
  ...authLoginValidate,
  ...authRegisterValidate,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, email } = req.body;
    try {
      const msg = await createUser({ username, password, email });
      res.status(200).json(msg).end();
    } catch (error) {
      next(error);
    }
  },
];

authController.loginRoutePOST = [
  ...authLoginValidate,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.status(401).json({
          error: info?.message || "Invalid credentials",
        });
      }

      req.logIn(user, async (err) => {
        if (err) return next(err);

        try {
          const token = await JWT.generateJwtToken(user);
          return res.status(200).json({ token });
        } catch (tokenErr) {
          return next(tokenErr);
        }
      });
    })(req, res, next);
  },
];

export default authController;
