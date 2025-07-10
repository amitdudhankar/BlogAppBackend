const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware"); // ✅ import multer config

// 📌 Protected: Add Blog Post (requires login and thumbnail upload)
router.post(
    "/add-comment",
    verifyToken,
    commentsController.addComment
);
// routes/comment.routes.js
router.put(
    "/update-comment/:commentId",
    verifyToken,
    commentsController.updateComment
);
router.get(
    "/get-comments/:postId",
    commentsController.getCommentByPostId
);
router.delete(
    "/delete-comment/:commentId",
    verifyToken,
    commentsController.deleteComment
);



// ✅ Export the router
module.exports = router;
