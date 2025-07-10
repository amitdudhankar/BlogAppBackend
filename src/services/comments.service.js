// services/comments.service.js
const query = require("../utils/db");

exports.addComment = async ({ postId, comment, userId }) => {
    try {
        const result = await query(
            `INSERT INTO comments (user_id, post_id, comment, created_at)
       VALUES (?, ?, ?, NOW())`,
            [userId, postId, comment]
        );

        const commentId = result.insertId;

        return {
            id: commentId,
            user_id: userId,
            post_id: postId,
            comment,
            created_at: new Date().toISOString(), // optional for frontend
        };
    } catch (error) {
        console.error("❌ Error in addComment service:", error);
        throw new Error("Error while adding comment: " + error.message);
    }
};
exports.updateComment = async ({ commentId, comment, userId }) => {
    try {
        const result = await query(
            `UPDATE comments SET comment = ? WHERE id = ? AND user_id = ?`,
            [comment, commentId, userId]
        );

        if (result.affectedRows === 0) {
            throw new Error("Comment not found or does not belong to the user.");
        }

        // ✅ Fetch and return the updated comment
        const [updatedComment] = await query(
            `SELECT id, comment FROM comments WHERE id = ?`,
            [commentId]
        );

        return updatedComment;
    } catch (error) {
        console.error("❌ Error in updateComment service:", error);
        throw new Error("Error while updating comment: " + error.message);
    }
};
exports.getCommentByPostId = async (postId) => {
    try {
        const comments = await query(
            `SELECT c.id, c.comment, c.created_at, u.username 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.post_id = ?`,
            [postId]
        );

        return comments;
    } catch (error) {
        console.error("❌ Error in getCommentByPostId service:", error);
        throw new Error("Error while fetching comments: " + error.message);
    }
};
exports.deleteComment = async (commentId, userId) => {
    try {
        const result = await query(
            `DELETE FROM comments WHERE id = ? AND user_id = ?`,
            [commentId, userId]
        );

        if (result.affectedRows === 0) {
            throw new Error("Comment not found or does not belong to the user.");
        }

        return { message: "Comment deleted successfully." };
    } catch (error) {
        console.error("❌ Error in deleteComment service:", error);
        throw new Error("Error while deleting comment: " + error.message);
    }
}