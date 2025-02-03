import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
} from "../controllers/identity-controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshTokenUser);
router.post("/logout", logoutUser);

export default router;
