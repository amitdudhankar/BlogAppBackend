const commentsService = require("../services/comments.service");
const query = require("../utils/db"); // assuming this is your db connection

exports.addComment = async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const userId = req.user?.id;

        if (!postId || !comment || !userId) {
            return res.status(400).json({
                message: "Post ID, comment text, and user ID are required.",
            });
        }

        // ✅ Validate that post exists
        const [postExists] = await query(`SELECT id FROM posts WHERE id = ?`, [postId]);

        if (!postExists) {
            return res.status(404).json({
                message: `Post with ID ${postId} does not exist.`,
            });
        }

        const newComment = await commentsService.addComment({
            postId,
            comment,
            userId,
        });

        return res.status(201).json({
            message: "Comment added successfully.",
            comment: newComment,
        });
    } catch (error) {
        console.error("❌ Error in addComment controller:", error);
        return res.status(500).json({
            message: "Something went wrong while adding the comment.",
            error: error.message,
        });
    }
};
exports.updateComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const commentId = parseInt(req.params.commentId);
        const userId = req.user?.id;

        if (!commentId || isNaN(commentId) || !comment || !userId) {
            return res.status(400).json({
                message: "Valid Comment ID (as param), comment text, and user ID are required.",
            });
        }

        // ✅ Validate that comment exists and belongs to the user
        const [existingComment] = await query(
            `SELECT id FROM comments WHERE id = ? AND user_id = ?`,
            [commentId, userId]
        );

        if (!existingComment) {
            return res.status(404).json({
                message: `Comment with ID ${commentId} does not exist or does not belong to the user.`,
            });
        }

        const updatedComment = await commentsService.updateComment({ commentId, comment, userId });

        return res.status(200).json({
            message: "Comment updated successfully.",
            comment: updatedComment,
        });

    } catch (error) {
        console.error("❌ Error in updateComment controller:", error);
        return res.status(500).json({
            message: "Something went wrong while updating the comment.",
            error: error.message,
        });
    }
};
exports.getCommentByPostId = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);

        // 🧪 Validate
        if (!postId || isNaN(postId)) {
            return res.status(400).json({
                message: "Valid Post ID (as param) and user ID are required.",
            });
        }

        // ✅ Check if post exists
        const [postExists] = await query(`SELECT id FROM posts WHERE id = ?`, [postId]);
        if (!postExists) {
            return res.status(404).json({
                message: `Post with ID ${postId} does not exist.`,
            });
        }

        // ✅ Call service
        const comments = await commentsService.getCommentByPostId(postId);

        return res.status(200).json({
            message: "Comments retrieved successfully.",
            comments,
        });

    } catch (error) {
        console.error("❌ Error in getCommentByPostId controller:", error);
        return res.status(500).json({
            message: "Something went wrong while retrieving comments.",
            error: error.message,
        });
    }
};
exports.deleteComment = async (req, res) => {
    try {
        const commentId = parseInt(req.params.commentId);
        const userId = req.user?.id;

        if (!commentId || isNaN(commentId) || !userId) {
            return res.status(400).json({
                message: "Valid Comment ID (as param) and user ID are required.",
            });
        }

        // ✅ Validate that comment exists and belongs to the user
        const [existingComment] = await query(
            `SELECT id FROM comments WHERE id = ? AND user_id = ?`,
            [commentId, userId]
        );

        if (!existingComment) {
            return res.status(404).json({
                message: `Comment with ID ${commentId} does not exist or does not belong to the user.`,
            });
        }

        await commentsService.deleteComment(commentId, userId);

        return res.status(200).json({
            message: "Comment deleted successfully.",
        });

    } catch (error) {
        console.error("❌ Error in deleteComment controller:", error);
        return res.status(500).json({
            message: "Something went wrong while deleting the comment.",
            error: error.message,
        });
    }
}