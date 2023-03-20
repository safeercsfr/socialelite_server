import express from "express";
import {
  deletePost,
  getFeedPosts,
  getUserPosts,
  likePost,
  postComment,
} from "../controllers/posts.js";
import { verifyToken } from "../middlleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, postComment);

/* DELETE */
router.delete("/:postId", verifyToken, deletePost);

export default router;
