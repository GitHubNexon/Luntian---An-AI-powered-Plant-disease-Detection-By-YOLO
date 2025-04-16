const User = require("../models/userModel");
const { generateHash } = require("../controllers/authController");

const createUser = async (req, res) => {
  try {
    // Destructure the necessary fields from the request body
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      userType,
      status,
      profileImage,
    } = req.body;

    // Check if the user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await generateHash(password);

    // Create a new user with the hashed password and other details
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      status, // status field
      profileImage, // profileImage field
    });

    // Save the new user
    await newUser.save();

    // Send success response
    res
      .status(201)
      .json({ message: "User Created Successfully", user: newUser });
  } catch (error) {
    // Handle errors
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Get user failed", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await User.findById(id);

    if (!updatedUser) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Handle password hashing separately
    if (updatedData.password && updatedData.password !== updatedUser.password) {
      updatedUser.password = await generateHash(updatedData.password);
    }

    // Update other fields
    Object.keys(updatedData).forEach((key) => {
      if (key !== "password" && updatedData[key] !== updatedUser[key]) {
        updatedUser[key] = updatedData[key];
      }
    });

    updatedUser.__v = updatedUser.__v + 1;
    await updatedUser.save();

    res.status(200).json({ message: "Update User Successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting User:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const keyword = req.query.keyword || "";
    const status = req.query.status;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? -1 : 1;

    const query = {
      ...(keyword && {
        $or: [
          { username: { $regex: keyword, $options: "i" } },
          { firstName: { $regex: keyword, $options: "i" } },
          { lastName: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }),
      ...(status === "isDeleted" && { "status.isDeleted": true }),
      ...(status === "isArchived" && { "status.isArchived": true }),
    };

    const sortCriteria = {
      "status.isDeleted": 1,
      "status.isArchived": 1,
      [sortBy]: sortOrder,
    };

    const totalItems = await User.countDocuments(query);
    const users = await User.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      users: users,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userRecord = await User.findById(id);
    if (!userRecord || !userRecord.status) {
      return res
        .status(404)
        .json({ message: "User record or status not found" });
    }
    if (userRecord.status.isArchived) {
      return res
        .status(400)
        .json({ message: "Cannot delete an archived user record." });
    }

    if (userRecord.status.isDeleted) {
      return res
        .status(400)
        .json({ message: "User record is already deleted." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { "status.isDeleted": true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User record not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(
      "Error deleting depreciation record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};

const softArchiveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userRecord = await User.findById(id);
    if (!userRecord || !userRecord.status) {
      return res
        .status(404)
        .json({ message: "User record or status not found" });
    }
    if (userRecord.status.isDeleted) {
      return res
        .status(400)
        .json({ message: "Cannot archive a deleted user record." });
    }

    if (userRecord.status.isArchived) {
      return res
        .status(400)
        .json({ message: "User record is already archived." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { "status.isArchived": true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User record not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error archiving user record:", error.message, error.stack);
    res.status(500).json({ message: "Error processing request" });
  }
};

const undoDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userRecord = await User.findById(id);
    if (!userRecord || !userRecord.status) {
      return res
        .status(404)
        .json({ message: "User record or status not found" });
    }
    if (!userRecord.status.isDeleted) {
      return res.status(400).json({ message: "User record is not deleted." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { "status.isDeleted": false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User record not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(
      "Error undoing delete on user record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};

const undoArchiveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userRecord = await User.findById(id);
    if (!userRecord || !userRecord.status) {
      return res
        .status(404)
        .json({ message: "User record or status not found" });
    }
    if (!userRecord.status.isArchived) {
      return res.status(400).json({ message: "User record is not archived." });
    }
    if (userRecord.status.isDeleted) {
      return res
        .status(400)
        .json({ message: "Cannot undo archive for a deleted user record." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { "status.isArchived": false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User record not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(
      "Error undoing archive on user record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  softDeleteUser,
  softArchiveUser,
  undoDeleteUser,
  undoArchiveUser,
  getUserById,
};
