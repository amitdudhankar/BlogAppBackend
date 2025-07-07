const blogPostService = require("../services/blogPost.service");

// ✅ Add Blog Post Controller

exports.addBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file;

    // 🧠 Extract user from decoded JWT
    const userId = req.user?.id;
    const author = req.user?.username;

    // 🧪 Validate required fields
    if (!title || !content || !file || !author || !userId) {
      return res.status(400).json({
        message: "Title, Content, Thumbnail, and valid user (author) are required.",
      });
    }

    // 🌐 Generate full thumbnail URL
    const thumbnailUrl = `${req.protocol}://${req.get("host")}/uploads/thumbnails/${file.filename}`;

    // 🛠️ Call service to add blog post
    const newBlogPost = await blogPostService.addBlogPost({
      title,
      content,
      author,
      userId,
      thumbnail: thumbnailUrl,
    });

    // ✅ Respond with success
    return res.status(201).json({
      message: "Blog post added successfully",
      blogPost: newBlogPost,
    });
  } catch (error) {
    console.error("❌ Error in addBlogPost:", error);

    // 🔍 Known validation/database error
    if (
      error.message.includes("ER_DUP_ENTRY") ||
      error.message.includes("Invalid input") ||
      error.message.includes("Error while adding blog post")
    ) {
      return res.status(400).json({ message: error.message });
    }

    // 🧨 Unexpected error
    return res.status(500).json({
      message: "Something went wrong while creating the blog post.",
      error: error.message,
    });
  }
};


exports.updateBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file;
    const id = req.params.blogid;

    if (!id) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const updates = {};

    if (title) updates.title = title;
    if (content) updates.content = content;
    if (file) {
      updates.thumbnail = `${req.protocol}://${req.get("host")}/uploads/thumbnails/${file.filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "At least one field must be provided for update." });
    }

    // 👇 Call service with ID and dynamic updates
    const updatedBlogPost = await blogPostService.updateBlogPost({ id, ...updates });

    return res.status(200).json({
      message: "Blog post updated successfully",
      blogPost: updatedBlogPost,
    });
  } catch (error) {
    console.error("❌ Error in updateBlogPost:", error);
    return res.status(500).json({
      message: "Something went wrong while updating the blog post.",
      error: error.message,
    });
  }
};
exports.getAllBlogPost = async (req, res) => {
  try {
    // 🛠️ Call service to get all blog posts
    const blogPosts = await blogPostService.getAllBlogPost();

    // ✅ Respond with success
    return res.status(200).json({
      message: "All blog posts retrieved successfully",
      blogPosts,
    });
  } catch (error) {
    console.error("❌ Error in getAllBlogPost:", error);
    return res.status(500).json({
      message: "Something went wrong while retrieving blog posts.",
      error: error.message,
    });
  }
}

exports.deleteBlogPost = async (req, res) => {
  try {
    const id = req.params.blogid;
    const userId = req.user.id; // 👈 assuming you've set this via middleware

    if (!id) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    // 🛠️ Call service to delete blog post
    const result = await blogPostService.deleteBlogPost(id, userId);

    // ✅ Respond with success
    return res.status(200).json({
      message: result.message,
      blogPostId: id,
    });

  } catch (error) {
    console.error("❌ Error in deleteBlogPost:", error);
    return res.status(500).json({
      message: "Something went wrong while deleting the blog post.",
      error: error.message,
    });
  }
};


// exports.deleteBlogPost = async (req, res) => {
//   try {
//     const id = req.params.blogid;

//     if (!id) {
//       return res.status(400).json({ message: "Post ID is required." });
//     }

//     // 🛠️ Call service to delete blog post
//     const result = await blogPostService.deleteBlogPost(id);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Blog post not found." });
//     }

//     // ✅ Respond with success
//     return res.status(200).json({
//       message: "Blog post deleted successfully",
//       blogPostId: id,
//     });
//   } catch (error) {
//     console.error("❌ Error in deleteBlogPost:", error);
//     return res.status(500).json({
//       message: "Something went wrong while deleting the blog post.",
//       error: error.message,
//     });
//   }
// };