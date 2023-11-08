import { Router } from "express";
import { usersManager } from "../managers/usersManager.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All filds are required" });
  }
  try {
    const userCreated = await usersManager.createOne(req.body);
    res.status(200).json({ message: "user created", userCreated });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "all fields are requierd" });
  }

  try {
    const user = await usersManager.findByEmail(email);
    if (!user) {
      return res.redirect("/signup");
    }
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "password is not valid" });
    }

    const sessionInfo =
      email === "adminCoder@coder.com" && password === "adminCod3r123"
        ? { email, first_name: user.first_name, role: "admin" }
        : { email, first_name: user.first_name, role: "user" };
    req.session.user = sessionInfo;
    res.redirect("/profile");
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
