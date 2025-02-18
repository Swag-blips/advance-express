import { Router } from "express";
import passport from "passport";
import {
  authStatus,
  login,
  logout,
  register,
  reset2FA,
  setup2FA,
  verify2FA,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", passport.authenticate("local"), login);
router.get("/status", authStatus);
router.post("/logout", logout);
router.post(
  "/2fa/setup",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  },
  setup2FA
);
router.post("/2fa/verify", verify2FA);
router.post("/2fa/reset", reset2FA);

export default router;
