const express = require("express");
const router = express.Router();
const postTagsController = require("../controllers/postTags.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// 📌 Add a tag to a post
router.post(
  "/add-post-tag",
  verifyToken,
  postTagsController.addTagToPost
);

// 📌 Remove a tag from a post
router.delete(
  "/remove-post-tag/:postId/:tagId",
  verifyToken,
  postTagsController.removeTagFromPost
);

// 📌 Get all tags for a post
router.get(
  "/get-all-tags-for-post/:postId",
  postTagsController.getTagsForPost
);

// 📌 Get all posts for a tag
router.get(
  "/get-posts-by-tag/:tagId",
  postTagsController.getPostsByTag
);

// ✅ Export the router
module.exports = router;