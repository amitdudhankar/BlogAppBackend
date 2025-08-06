// controllers/postTags.controller.js

const postTagsService = require("../services/postTags.service");

// 📌 Add Tag to Post Controller
exports.addTagToPost = async (req, res) => {
  try {
    const userId = req.user?.id; // Get user ID from JWT middleware
    const { postId, tagId } = req.body;

    // Input validation
    if (!postId || !tagId || !userId) {
      return res.status(400).json({
        message: "Post ID, Tag ID, and User ID are required.",
      });
    }

    // Call the service to perform tag addition
    const result = await postTagsService.addTagToPost({ postId, tagId, userId });

    return res.status(201).json({
      message: "Tag added to post successfully.",
      tag: result,
    });
  } catch (error) {
    console.error("❌ Error in addTagToPost controller:", error);
    if (error.message === "Tag already associated with this post.") {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Something went wrong while adding the tag to the post.",
      error: error.message,
    });
  }
};

// 📌 Remove Tag from Post Controller
exports.removeTagFromPost = async (req, res) => {
  try {
    const userId = req.user?.id; // Get user ID from JWT middleware
    const postId = parseInt(req.params.postId);
    const tagId = parseInt(req.params.tagId);

    // Input validation
    if (!postId || isNaN(postId) || !tagId || isNaN(tagId) || !userId) {
      return res.status(400).json({
        message: "Valid Post ID, Tag ID (as params), and User ID are required.",
      });
    }

    // Call the service to perform tag removal
    const result = await postTagsService.removeTagFromPost({ postId, tagId, userId });

    return res.status(200).json({
      message: "Tag removed from post successfully.",
      ...result,
    });
  } catch (error) {
    console.error("❌ Error in removeTagFromPost controller:", error);
    if (error.message === "Tag not associated with this post.") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Something went wrong while removing the tag from the post.",
      error: error.message,
    });
  }
};

// 📌 Get Tags for a Post Controller
exports.getTagsForPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);

    // Input validation
    if (!postId || isNaN(postId)) {
      return res.status(400).json({
        message: "Valid Post ID (as param) is required.",
      });
    }

    // Call the service to get tags for the post
    const tags = await postTagsService.getTagsForPost(postId);

    return res.status(200).json({
      post_id: postId,
      tags,
    });
  } catch (error) {
    console.error("❌ Error in getTagsForPost controller:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching tags for the post.",
      error: error.message,
    });
  }
};

// 📌 Get Posts by Tag Controller
exports.getPostsByTag = async (req, res) => {
  try {
    const tagId = parseInt(req.params.tagId);

    // Input validation
    if (!tagId || isNaN(tagId)) {
      return res.status(400).json({
        message: "Valid Tag ID (as param) is required.",
      });
    }

    // Call the service to get posts for the tag
    const posts = await postTagsService.getPostsByTag(tagId);

    return res.status(200).json({
      tag_id: tagId,
      posts,
    });
  } catch (error) {
    console.error("❌ Error in getPostsByTag controller:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching posts for the tag.",
      error: error.message,
    });
  }
};