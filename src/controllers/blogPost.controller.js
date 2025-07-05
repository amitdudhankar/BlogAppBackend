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