import { Router } from "express";
import { usersManager } from "../managers/usersManager.js";
import { hashData, compareData } from "../utils.js";
import passport from "passport";

const router = Router();

// router.post("/signup", async (req, res) => {
//   const { first_name, last_name, email, password } = req.body;

//   if (!first_name || !last_name || !email || !password) {
//     return res.status(400).json({ message: "All filds are required" });
//   }
//   try {
//     const hashPassword = await hashData(password);
//     const userCreated = await usersManager.createOne({
//       ...req.body,
//       password: hashPassword,
//     });
//     res.status(200).json({ message: "user created", userCreated });
//   } catch (error) {
//     res.status(500).json({ error });
//     console.log(error);
//   }
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: "all fields are requierd" });
//   }

//   try {
//     const user = await usersManager.findByEmail(email);
//     if (!user) {
//       return res.redirect("/signup");
//     }

//     /*  const isPasswordValid = password === user.password; */

//     const isPasswordValid = await compareData(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "password is not valid" });
//     }

//     const sessionInfo =
//       email === "adminCoder@coder.com" && password === "adminCod3r123"
//         ? { email, first_name: user.first_name, role: "admin" }
//         : { email, first_name: user.first_name, role: "user" };
//     req.session.user = sessionInfo;
//     res.redirect("/profile");
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

// SIGNUP - LOGIN - PASSPORT

router.post(
  "/signup",
  passport.authenticate("signup", { successRedirect: "/login" })
);
router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/profile",
    failureRedirect: "/error",
  })
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

export default router;
