import { Router } from "express";

const router = Router();

/* router.get("/", (req, res) => {
  res.render("cookies");
});
 */

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/profile");
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.user) {
    return res.redirect("/profile");
  }
  res.render("signup");
});

router.get("/profile", (req, res) => {
  if (!req.session.passport) {
    return res.redirect("/login");
  }

  const { first_name, email } = req.user;
  res.render("profile", { user: { first_name, email } });
});

router.get("/reset", (req, res) => {
  res.render("reset");
});

router.get("/error", (req, res) => {
  res.render("error");
});

export default router;
