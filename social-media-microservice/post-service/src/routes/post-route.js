import express from "express";
import { createPost } from "../controllers/post-controller.js";
import authenticateRequest from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateRequest);

router.post("/create-post", createPost);

export default router;
