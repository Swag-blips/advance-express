import express from "express";
import { createPost, getAllPosts, getPost } from "../controllers/post-controller.js";
import authenticateRequest from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateRequest);

router.post("/create-post", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPost)

export default router;
