const router = express.Router();
import express from "express";
import {
  getUser,
  getUserFollowers,
  getUsers,
  getUserFriends,
  followFriend,
  unFollowFriend,
  followBackFriend,
  updateUser,
  getSuggestionUsers,
  getNotifications,
} from "../controllers/users.js";
import { verifyToken } from "../middlleware/auth.js";

/* READ */
router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUser);
router.get("/:id/followers", verifyToken, getUserFollowers);
router.get("/:id/followings", verifyToken, getUserFriends);
router.get("/:id/suggestions", verifyToken, getSuggestionUsers);
router.get("/:id/notifications", verifyToken, getNotifications);

/*UPDATE USER */
router.put("/:id", verifyToken, updateUser);

/* UPDATE */
router.patch("/:id/:friendId/follow", verifyToken, followFriend);
router.patch("/:id/:friendId/unfollow", verifyToken, unFollowFriend);
router.patch("/:id/:friendId/followback", verifyToken, followBackFriend);

export default router;
