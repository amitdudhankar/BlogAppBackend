const query = require("../utils/db");

// 📌 Service: Add tag to a post
exports.addTagToPost = async ({ postId, tagId, userId }) => {
  try {
    // Step 1: Prevent duplicate tag associations
    const [existing] = await query(
      "SELECT id FROM post_tags WHERE post_id = ? AND tag_id = ?",
      [postId, tagId]
    );
    if (existing) {
      throw new Error("Tag already associated with this post.");
    }

    // Step 2: Verify post and tag exist
    const [post] = await query("SELECT id FROM posts WHERE id = ?", [postId]);
    const [tag] = await query("SELECT id FROM tags WHERE id = ?", [tagId]);
    if (!post || !tag) {
      throw new Error("Post or Tag not found.");
    }

    // Step 3: Insert new tag association
    const result = await query(
      "INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)",
      [postId, tagId]
    );

    // Step 4: Return tag info
    return {
      id: result.insertId,
      post_id: postId,
      tag_id: tagId,
    };
  } catch (error) {
    console.error("❌ Error in addTagToPost service:", error);
    throw new Error(error.message);
  }
};

// 📌 Service: Remove tag from a post
exports.removeTagFromPost = async ({ postId, tagId, userId }) => {
  try {
    // Step 1: Check if the tag association exists
    const [existingTag] = await query(
      "SELECT id FROM post_tags WHERE post_id = ? AND tag_id = ?",
      [postId, tagId]
    );
    if (!existingTag) {
      throw new Error("Tag not associated with this post.");
    }

    // Step 2: Delete the tag association
    const result = await query(
      "DELETE FROM post_tags WHERE post_id = ? AND tag_id = ?",
      [postId, tagId]
    );

    // Step 3: Return info/confirmation
    return {
      deleted: true,
      post_id: postId,
      tag_id: tagId,
    };
  } catch (error) {
    console.error("❌ Error in removeTagFromPost service:", error);
    throw new Error(error.message);
  }
};

// 📌 Service: Get tags for a post
exports.getTagsForPost = async (postId) => {
  try {
    // Fetch tags associated with the post
    const results = await query(
      `SELECT t.id, t.name
       FROM post_tags pt
       JOIN tags t ON pt.tag_id = t.id
       WHERE pt.post_id = ?`,
      [postId]
    );
    return results;
  } catch (error) {
    console.error("❌ Error in getTagsForPost service:", error);
    throw new Error(error.message);
  }
};

// 📌 Service: Get posts by tag
exports.getPostsByTag = async (tagId) => {
  try {
    // Fetch posts associated with the tag
    const results = await query(
      `SELECT p.id, p.title, p.content
       FROM post_tags pt
       JOIN posts p ON pt.post_id = p.id
       WHERE pt.tag_id = ?`,
      [tagId]
    );
    return results;
  } catch (error) {
    console.error("❌ Error in getPostsByTag service:", error);
    throw new Error(error.message);
  }
};