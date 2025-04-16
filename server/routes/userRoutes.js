const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  softDeleteUser,
  softArchiveUser,
  undoDeleteUser,
  undoArchiveUser,
  getUserById,
} = require("../controllers/userController");

const { authenticateToken } = require("../controllers/authController");

// Get all users
router.get("/get-all", authenticateToken, getAllUsers);

// Create a new user
router.post("/create", authenticateToken, createUser);

// Update a user
router.patch("/update/:id", authenticateToken, updateUser);

// Delete a user
router.delete("/delete/:id", authenticateToken, deleteUser);

// Soft delete a user
router.post("/soft-delete/:id", authenticateToken, softDeleteUser);

// Soft archive a user
router.post("/soft-archive/:id", authenticateToken, softArchiveUser);

// Undo delete on a user
router.post("/undo-delete/:id", authenticateToken, undoDeleteUser);

// Undo archive on a user
router.post("/undo-archive/:id", authenticateToken, undoArchiveUser);

//get user by id
router.get("/get-user/:id", authenticateToken, getUserById)

module.exports = router;
