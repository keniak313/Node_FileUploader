import bcrypt from "bcryptjs";
import passport from "passport";
import LocalStrategy from "passport-local";
import * as db from "../db/queries.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        const getUser = await db.User().getUserByEmail(username);
        const user = getUser[0];

        if (!user) {
          return done(null, false, { message: "Incorrect Email" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect Password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User().getUserById(id);
    done(null, user[0]);
  } catch (err) {
    return done(err);
  }
});

export const loginGet = async (req, res) => {
  res.render("login-form");
};

export const loginPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureMessage: true,
  failWithError: true,
});

export const signupGet = async (req, res) => {
  res.render("signup-form");
};

export const signupPost = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = await db.User().createUser(req.body.email, hashedPassword, req.body.username);
  console.log(newUser);
  await db.Folders().createMainFolder(newUser.id)
  res.redirect("/");
};

export const logoutGet = async (req, res, next) =>{
  await req.logout((err) =>{
    if(err){
      return next(err)
    }
  })
  res.redirect('/')
}