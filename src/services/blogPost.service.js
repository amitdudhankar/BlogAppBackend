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

exports.updateBlogPost = async ({ id, title, content, thumbnail }) => {
    try {
        if (!id) {
            throw new Error("Post ID is required.");
        }

        const fields = [];
        const values = [];

        // Dynamically build query fields and values
        if (title) {
            fields.push("title = ?");
            values.push(title);

            // Also update slug if title is given
            const slug = slugify(title, { lower: true, strict: true });
            fields.push("slug = ?");
            values.push(slug);
        }

        if (content) {
            fields.push("content = ?");
            values.push(content);
        }

        if (thumbnail) {
            fields.push("thumbnail_url = ?");
            values.push(thumbnail);
        }

        if (fields.length === 0) {
            throw new Error("No fields provided to update.");
        }

        // Always update timestamp
        fields.push("updated_at = NOW()");

        // Final query
        const sql = `UPDATE posts SET ${fields.join(", ")} WHERE id = ?`;
        values.push(id); // ID goes last

        const result = await query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error("Blog post not found or no changes made.");
        }

        return {
            id,
            ...(title && { title }),
            ...(title && { slug: slugify(title, { lower: true, strict: true }) }),
            ...(content && { content }),
            ...(thumbnail && { thumbnail_url: thumbnail }),
        };
    } catch (error) {
        console.error("❌ Error in updateBlogPost service:", error);
        throw new Error("Error while updating blog post: " + error.message);
    }
};
exports.getAllBlogPost = async () => {
    try {
        const results = await query(
            `SELECT p.id, p.title, p.slug, p.content, p.author, p.user_id, 
                    p.thumbnail_url, p.created_at, p.updated_at
             FROM posts p
             ORDER BY p.created_at DESC`
        );

        return results.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            content: post.content,
            author: post.author,
            thumbnail: post.thumbnail_url,
            createdAt: post.created_at,
        }));
    } catch (error) {
        console.error("❌ Error in getAllBlogPost service:", error);
        throw new Error("Error while retrieving blog posts: " + error.message);
    }
}

exports.deleteBlogPost = async (postId, userId) => {
    try {
        if (!postId || !userId) {
            throw new Error("Post ID and User ID are required.");
        }

        // 🧾 Step 1: Check if the blog post exists and belongs to the user
        const [post] = await query(`SELECT * FROM posts WHERE id = ?`, [postId]);

        if (!post) {
            throw new Error("Blog post not found.");
        }

        if (post.user_id !== userId) {
            throw new Error("You are not authorized to delete this blog post.");
        }

        // 🗑️ Step 2: Delete the blog post
        const result = await query(`DELETE FROM posts WHERE id = ?`, [postId]);

        return { message: "Blog post deleted successfully." };

    } catch (error) {
        console.error("❌ Error in deleteBlogPost service:", error);
        throw new Error("Error while deleting blog post: " + error.message);
    }
};
