import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexRouter } from "./routes/indexRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "passport";
import { getAllResources } from "./uploadConfig.js";

export const prisma = new PrismaClient();

// async function main() {}

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(__dirname, "./public");
app.use(express.static(assetsPath));

app.use("/public", express.static(assetsPath));

// app.use('/uploads', express.static('/uploads'))

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 1000, //ms
    },
    secret: "cats loves boxes",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
app.use(passport.session());

app.use((req, res, next) => {
  if (req.user) {
    res.locals.currentUser = req.user;
    res.locals.uploadPath = `/public/data/uploads/${req.user.id}/`;
  }
  next();
});

app.use("/auth", authRouter);
app.use("/", indexRouter);

//Middleware for ERROR handling
app.use((err, req, res, next) =>{
  console.error(err)
  res.status(err.statusCode || 500).render(`error`, {status:err.statusCode, message: err.message})
})

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT,HOST, () => {
  console.log(`Listening on: ${PORT}`);
});
