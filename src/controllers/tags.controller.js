// controllers/tags.controller.js

const tagsService = require("../services/tags.service");

// 📌 Create Tag(s) Controller
exports.createTag = async (req, res) => {
    try {
        const userId = req.user?.id; // Get user ID from JWT middleware
        let { name, names } = req.body;

        // Support both "name" (string) and "names" (array or string)
        let tagsToCreate;
        if (Array.isArray(names)) {
            tagsToCreate = names;
        } else if (Array.isArray(name)) {
            tagsToCreate = name;
        } else if (typeof name === "string") {
            tagsToCreate = [name];
        } else if (typeof names === "string") {
            tagsToCreate = [names];
        } else {
            tagsToCreate = [];
        }

        // Input validation
        if (!tagsToCreate.length || !userId) {
            return res.status(400).json({
                message: "Tag name(s) and User ID are required.",
            });
        }

        // Call the service
        const result = await tagsService.createTags({ names: tagsToCreate, userId });
        return res.status(201).json({
            message: "Tag(s) processed successfully.",
            ...result,
        });
    } catch (error) {
        console.error("❌ Error in createTag(s) controller:", error);
        if (error.message.includes("exist")) {
            return res.status(409).json({ message: error.message });
        }
        return res.status(500).json({
            message: "Something went wrong while creating the tag(s).",
            error: error.message,
        });
    }
};


// 📌 Update Tag Controller
exports.updateTag = async (req, res) => {
  try {
    const userId = req.user?.id; // Get user ID from JWT middleware
    const tagId = parseInt(req.params.tagId);
    const { name } = req.body;

    // Input validation
    if (!tagId || isNaN(tagId) || !name || !userId) {
      return res.status(400).json({
        message: "Valid Tag ID (as param), tag name, and User ID are required.",
      });
    }

    // Call the service to update the tag
    const result = await tagsService.updateTag({ tagId, name, userId });

    return res.status(200).json({
      message: "Tag updated successfully.",
      tag: result,
    });
  } catch (error) {
    console.error("❌ Error in updateTag controller:", error);
    if (error.message === "Tag not found.") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Tag name already exists.") {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Something went wrong while updating the tag.",
      error: error.message,
    });
  }
};

// 📌 Delete Tag Controller
exports.deleteTag = async (req, res) => {
  try {
    const userId = req.user?.id; // Get user ID from JWT middleware
    const tagId = parseInt(req.params.tagId);

    // Input validation
    if (!tagId || isNaN(tagId) || !userId) {
      return res.status(400).json({
        message: "Valid Tag ID (as param) and User ID are required.",
      });
    }

    // Call the service to delete the tag
    const result = await tagsService.deleteTag({ tagId, userId });

    return res.status(200).json({
      message: "Tag deleted successfully.",
      ...result,
    });
  } catch (error) {
    console.error("❌ Error in deleteTag controller:", error);
    if (error.message === "Tag not found.") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Something went wrong while deleting the tag.",
      error: error.message,
    });
  }
};

// 📌 Get Tag by ID Controller
exports.getTagById = async (req, res) => {
  try {
    const tagId = parseInt(req.params.tagId);

    // Input validation
    if (!tagId || isNaN(tagId)) {
      return res.status(400).json({
        message: "Valid Tag ID (as param) is required.",
      });
    }

    // Call the service to get the tag
    const tag = await tagsService.getTagById(tagId);

    return res.status(200).json({
      tag,
    });
  } catch (error) {
    console.error("❌ Error in getTagById controller:", error);
    if (error.message === "Tag not found.") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Something went wrong while fetching the tag.",
      error: error.message,
    });
  }
};

// 📌 Get All Tags Controller
exports.getAllTags = async (req, res) => {
  try {
    // Call the service to get all tags
    const tags = await tagsService.getAllTags();

    return res.status(200).json({
      tags,
    });
  } catch (error) {
    console.error("❌ Error in getAllTags controller:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching all tags.",
      error: error.message,
    });
  }
};