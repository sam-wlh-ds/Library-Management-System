import passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";
import { verifyUser } from '../db/authDB.js';
import { getUserById } from '../db/queryDB.js';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await verifyUser({username, password});
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch(err) {
    done(err);
  }
});

export default passport;

/*
Useage:

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

*/