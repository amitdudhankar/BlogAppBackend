const query = require("../utils/db");
const slugify = require("slugify");

// ✅ Add Blog Post Service
exports.addBlogPost = async ({ title, content, author, userId, thumbnail }) => {
    try {
        const slug = slugify(title, { lower: true, strict: true });

        const result = await query(
            `INSERT INTO posts 
   (title, slug, content, author, user_id, thumbnail_url, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [title, slug, content, author, userId, thumbnail]
        );


        const postId = result.insertId;

        return {
            id: postId,
            title,
            slug,
            content,
            user_id: userId,
            thumbnail_url: thumbnail,
        };
    } catch (error) {
        console.error("❌ Error in addBlogPost service:", error);
        throw new Error("Error while adding blog post: " + error.message);
    }
};
