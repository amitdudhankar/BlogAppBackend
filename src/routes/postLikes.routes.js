const express = require("express");
const router = express.Router();
const postLikesController = require("../controllers/postLikes.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// 📌 Like a Post (Create a like)
router.post(
  "/like",
  verifyToken,
  postLikesController.likePost
);

// 📌 Unlike a Post (Remove a like)
router.delete(
  "/unlike/:postId",
  verifyToken,
  postLikesController.unlikePost
);

// 📌 Get Likes Count for a Post (Read)
router.get(
  "/count/:postId",
  postLikesController.getLikesCount
);

// 📌 Check if Current User Liked a Post (Read)
router.get(
  "/is-liked/:postId",
  verifyToken,
  postLikesController.isPostLikedByUser
);

//(Optional) Get all users who liked a post
router.get(
  "/users/:postId",
  postLikesController.getUsersWhoLikedPost
);

// ✅ Export the router
module.exports = router;
