import { Router } from "express";
import { usersManager } from "../managers/usersManager.js";
import { hashData } from "../utils.js";
import passport from "passport";
import { generateToken } from "../utils.js";

const router = Router();

// SIGNUP - LOGIN - PASSPORT LOCAL

router.post(
  "/signup",
  passport.authenticate("signup", { successRedirect: "/profile" })
);
router.post(
  "/login",
  passport.authenticate(
    "login",
    {
      successRedirect: "/profile",
      failureRedirect: "/error",
    },
    (req, res) => {
      const token = generateToken(req.user);
      res.cookie("token", token);
    }
  )
);

// SIGNUP - LOGIN - PASSPORT GITHUB

router.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    successRedirect: "/profile",
    failureRedirect: "/error",
  })
);

router.get("/callback", passport.authenticate("github"), (req, res) => {
  res.send("probando");
});

// SIGNUP - LOGIN PASSPORT GOOGLE

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.post("/reset", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersManager.findByEmail(email);
    if (!user) {
      return res.redirect("/");
    }

    const hashPassword = await hashData(password);

    user.password = hashPassword;
    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/current", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "User not Authenticated" });
  }
  const user = req.user;

  res.status(200).json({ message: "User Authenticated", user });
});

export default router;
