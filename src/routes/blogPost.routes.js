const express = require("express");
const router = express.Router();
const blogPostController = require("../controllers/blogPost.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware"); // ✅ import multer config

// 📌 Protected: Add Blog Post (requires login and thumbnail upload)
router.post(
  "/add-blog",
  verifyToken,
  upload.single("thumbnail"),
  blogPostController.addBlogPost
);
router.put(
  "/update-blog/:blogid",
  verifyToken,
  upload.single("thumbnail"),
  blogPostController.updateBlogPost
);
router.get(
  "/get-all-blogs",
  verifyToken,
  upload.single("thumbnail"),
  blogPostController.getAllBlogPost
);
router.delete(
  "/delete-blog/:blogid",
  verifyToken,
  blogPostController.deleteBlogPost
);

// ✅ Export the router
module.exports = router;
