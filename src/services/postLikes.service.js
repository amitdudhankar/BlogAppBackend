const query = require("../utils/db");

// 📌 Service: Like a post
exports.likePost = async ({ postId, userId }) => {
  try {
    // Step 1: Prevent duplicate likes
    const [existing] = await query(
      "SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );
    if (existing) {
      // Already liked, do not add again
      throw new Error("Post already liked by this user.");
    }

    // Step 2: Insert new like
    const result = await query(
      "INSERT INTO post_likes (user_id, post_id, created_at) VALUES (?, ?, NOW())",
      [userId, postId]
    );

    // Step 3: Return like info
    return {
      id: result.insertId,
      user_id: userId,
      post_id: postId,
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Error in likePost service:", error);
    throw new Error(error.message);
  }
};

exports.unlikePost = async ({ postId, userId }) => {
  try {
    // Step 1: Check if the like exists
    const [existingLike] = await query(
      "SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );
    if (!existingLike) {
      throw new Error("Like not found for this user and post.");
    }

    // Step 2: Delete the like
    const result = await query(
      "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );

    // Step 3: Return info/confirmation
    return {
      deleted: true,
      post_id: postId,
      user_id: userId
    };
  } catch (error) {
    console.error("❌ Error in unlikePost service:", error);
    throw new Error(error.message);
  }
};

exports.getLikesCount = async (postId) => {
  try {
    // Optionally, you can check if the post exists here and return 0 or throw an error if not

    // Count likes for the given post
    const [result] = await query(
      "SELECT COUNT(*) AS count FROM post_likes WHERE post_id = ?",
      [postId]
    );
    return result.count;
  } catch (error) {
    console.error("❌ Error in getLikesCount service:", error);
    throw new Error(error.message);
  }
};

exports.isPostLikedByUser = async ({ postId, userId }) => {
  try {
    const [result] = await query(
      "SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );
    // If a like exists, result is truthy; otherwise, falsy
    return !!result;
  } catch (error) {
    console.error("❌ Error in isPostLikedByUser service:", error);
    throw new Error(error.message);
  }
};

exports.getUsersWhoLikedPost = async (postId) => {
  try {
    // You probably want to show user info (id, username, etc.)
    const results = await query(
      `SELECT u.id, u.username, u.email
       FROM post_likes pl
       JOIN users u ON pl.user_id = u.id
       WHERE pl.post_id = ?`,
      [postId]
    );
    // returns an array of user objects
    return results;
  } catch (error) {
    console.error("❌ Error in getUsersWhoLikedPost service:", error);
    throw new Error(error.message);
  }
};