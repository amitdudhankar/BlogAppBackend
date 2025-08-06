const express = require("express");
const router = express.Router();
const tagsController = require("../controllers/tags.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// 📌 Create a new tag
router.post(
  "/create-tag",
  verifyToken,
  tagsController.createTag
);

// 📌 Update an existing tag
router.put(
  "/update-tag/:tagId",
  verifyToken,
  tagsController.updateTag
);

// 📌 Delete a tag
router.delete(
  "/delete-tag/:tagId",
  verifyToken,
  tagsController.deleteTag
);

// 📌 Get a single tag by ID
router.get(
  "/get-tags/:tagId",
  tagsController.getTagById
);

// 📌 Get all tags
router.get(
  "/get-all-tags",
  tagsController.getAllTags
);

// ✅ Export the router
module.exports = router;