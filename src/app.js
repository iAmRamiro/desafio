import express from "express";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import cookieRouter from "./routes/cookie.router.js";
import sessionsRouter from "./routes/session.router.js";
import session from "express-session";

import "./db/configDB.js";
import MongoStore from "connect-mongo";
import "./passport.js";
import passport from "passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secretCookie"));

const URI =
  "mongodb+srv://iAmRamiro:lafamilia123@cluster0.q4vycww.mongodb.net/session47315?retryWrites=true&w=majority";

//mongo
app.use(
  session({
    store: new MongoStore({ mongoUrl: URI }),
    secret: "secretSession",
    cookie: { maxAge: 60000 },
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/sessions", sessionsRouter);

/* app.get("/crear", (req, res) => {
  res
    .cookie("cookie1", "miCookie", { maxAge: 120000 })
    .send("probando cookies");
});

app.get("/crearFirmada", (req, res) => {
  res
    .cookie("cookie2", "cookieFirmada", { maxAge: 120000, signed: true })
    .send("probando cookies");
});

app.get("/leer", (req, res) => {
  console.log(req);

  const { cookie1 } = req.cookies;
  const { cookie2 } = req.signedCookies;
  res.json({ cookies: cookie1, signedCookies: cookie2 });
  
});

app.get("/eliminar", (req, res) => {
  res.clearCookie("cookie1").send("eliminando cookie");
}); */

app.listen(8080, () => console.log("on port 8080"));
