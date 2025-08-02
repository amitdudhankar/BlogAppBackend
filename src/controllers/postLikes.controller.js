// controllers/postLikes.controller.js

const postLikesService = require("../services/postLikes.service");

// 📌 Like a Post Controller
exports.likePost = async (req, res) => {
  try {
    const userId = req.user?.id; // Get user ID from JWT middleware
    const { postId } = req.body;

    // Input validation
    if (!postId || !userId) {
      return res.status(400).json({
        message: "Post ID and User ID are required.",
      });
    }

    // Call the service to perform like action
    const result = await postLikesService.likePost({ postId, userId });

    return res.status(201).json({
      message: "Post liked successfully.",
      like: result,
    });
  } catch (error) {
    console.error("❌ Error in likePost controller:", error);
    // Custom handling for duplicate like, etc. (optional)
    if (error.message === "Post already liked by this user.") {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Something went wrong while liking the post.",
      error: error.message,
    });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const userId = req.user?.id; // Get user ID from JWT middleware
    const postId = parseInt(req.params.postId);

    // Input validation
    if (!postId || isNaN(postId) || !userId) {
      return res.status(400).json({
        message: "Valid Post ID (as param) and User ID are required.",
      });
    }

    // Call the service to perform unlike action
    const result = await postLikesService.unlikePost({ postId, userId });

    return res.status(200).json({
      message: "Post unliked successfully.",
      ...result, // Optional: include info about deleted row/count
    });
  } catch (error) {
    console.error("❌ Error in unlikePost controller:", error);
    // Optional: handle not-liked scenario
    if (error.message === "Like not found for this user and post.") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Something went wrong while unliking the post.",
      error: error.message,
    });
  }
};

// 📌 Get Likes Count for a Post Controller
exports.getLikesCount = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);

    // Input validation
    if (!postId || isNaN(postId)) {
      return res.status(400).json({
        message: "Valid Post ID (as param) is required.",
      });
    }

    // Call the service to get likes count for the post
    const count = await postLikesService.getLikesCount(postId);

    return res.status(200).json({
      post_id: postId,
      likesCount: count,
    });
  } catch (error) {
    console.error("❌ Error in getLikesCount controller:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching likes count.",
      error: error.message,
    });
  }
};

// 📌 Check if the current user liked a post
exports.isPostLikedByUser = async (req, res) => {
  try {
    const userId = req.user?.id; // from JWT middleware
    const postId = parseInt(req.params.postId || req.body.postId);

    // Validate inputs
    if (!postId || isNaN(postId) || !userId) {
      return res.status(400).json({
        message: "Valid Post ID (as param) and User ID (from JWT) are required.",
      });
    }

    // Query the service
    const liked = await postLikesService.isPostLikedByUser({ postId, userId });

    return res.status(200).json({
      post_id: postId,
      liked,
    });
  } catch (error) {
    console.error("❌ Error in isPostLikedByUser controller:", error);
    return res.status(500).json({
      message: "Something went wrong while checking like status.",
      error: error.message,
    });
  }
};

// 📌 Get list of users who liked a post
exports.getUsersWhoLikedPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);

    // Input validation
    if (!postId || isNaN(postId)) {
      return res.status(400).json({
        message: "Valid Post ID (as param) is required.",
      });
    }

    // Service call
    const users = await postLikesService.getUsersWhoLikedPost(postId);

    return res.status(200).json({
      post_id: postId,
      users, // Array of users who liked the post
    });
  } catch (error) {
    console.error("❌ Error in getUsersWhoLikedPost controller:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching users who liked the post.",
      error: error.message,
    });
  }
};