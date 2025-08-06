const query = require("../utils/db");

// 📌 Service: Create one or multiple tags
exports.createTags = async ({ names, userId }) => {
    try {
        if (!Array.isArray(names) || names.length === 0) {
            throw new Error("No tag names provided.");
        }

        // Step 1: Filter out duplicate names in input
        const uniqueNames = [...new Set(names.map(n => n.trim()).filter(Boolean))];

        // Step 2: Check for duplicates in DB
        let placeholders = uniqueNames.map(() => "?").join(",");
        const existing = await query(
            `SELECT name FROM tags WHERE name IN (${placeholders})`,
            uniqueNames
        );
        const existingNames = existing.map(t => t.name);

        // Identify which new tags can be created
        const newNames = uniqueNames.filter(n => !existingNames.includes(n));

        if (newNames.length === 0) {
            throw new Error("All provided tag names already exist.");
        }

        // Step 3: Insert new tags
        const insertResults = [];
        for (const name of newNames) {
            const result = await query("INSERT INTO tags (name) VALUES (?)", [name]);
            insertResults.push({ id: result.insertId, name });
        }

        // Step 4: Return result including which tags were existing
        return {
            created: insertResults,
            existing: existingNames,
        };
    } catch (error) {
        console.error("❌ Error in createTags service:", error);
        throw new Error(error.message);
    }
};


// 📌 Service: Update an existing tag
exports.updateTag = async ({ tagId, name, userId }) => {
  try {
    // Step 1: Check if tag exists
    const [existingTag] = await query(
      "SELECT id FROM tags WHERE id = ?",
      [tagId]
    );
    if (!existingTag) {
      throw new Error("Tag not found.");
    }

    // Step 2: Check for duplicate tag name
    const [duplicateName] = await query(
      "SELECT id FROM tags WHERE name = ? AND id != ?",
      [name, tagId]
    );
    if (duplicateName) {
      throw new Error("Tag name already exists.");
    }

    // Step 3: Update the tag
    await query(
      "UPDATE tags SET name = ? WHERE id = ?",
      [name, tagId]
    );

    // Step 4: Return updated tag info
    return {
      id: tagId,
      name,
    };
  } catch (error) {
    console.error("❌ Error in updateTag service:", error);
    throw new Error(error.message);
  }
};

// 📌 Service: Delete a tag
exports.deleteTag = async ({ tagId, userId }) => {
  try {
    // Step 1: Check if tag exists
    const [existingTag] = await query(
      "SELECT id FROM tags WHERE id = ?",
      [tagId]
    );
    if (!existingTag) {
      throw new Error("Tag not found.");
    }

    // Step 2: Delete associated post_tags entries
    await query(
      "DELETE FROM post_tags WHERE tag_id = ?",
      [tagId]
    );

    // Step 3: Delete the tag
    await query(
      "DELETE FROM tags WHERE id = ?",
      [tagId]
    );

    // Step 4: Return confirmation
    return {
      deleted: true,
      tag_id: tagId,
    };
  } catch (error) {
    console.error("❌ Error in deleteTag service:", error);
    throw new Error(error.message);
  }
};

// 📌 Service: Get a tag by ID
exports.getTagById = async (tagId) => {
  try {
    const [tag] = await query(
      "SELECT id, name FROM tags WHERE id = ?",
      [tagId]
    );
    if (!tag) {
      throw new Error("Tag not found.");
    }
    return tag;
  } catch (error) {
    console.error("❌ Error in getTagById service:", error);
    throw new Error(error.message);
  }
};

// 📌 Service: Get all tags
exports.getAllTags = async () => {
  try {
    const results = await query(
      "SELECT id, name FROM tags ORDER BY name ASC"
    );
    return results;
  } catch (error) {
    console.error("❌ Error in getAllTags service:", error);
    throw new Error(error.message);
  }
};