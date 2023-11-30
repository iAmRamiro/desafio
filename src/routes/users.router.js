import { Router } from "express";
import { usersManager } from "../managers/usersManager.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

router.get(
  "/:idUser",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["ADMIN", "PREMIUM"]),
  async (req, res) => {
    const { idUser } = req.params;
    console.log("user", req.user);
    const user = await usersManager.findById(idUser);

    res.json({ message: "user", user });
  }
);

export default router;
