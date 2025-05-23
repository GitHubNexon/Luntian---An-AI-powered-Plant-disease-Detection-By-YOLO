const express = require("express");
const router = express.Router();
const {
  readBase,
  createUserType,
  updateUserType,
  deleteUserType,
} = require("../controllers/baseController");
const { authenticateToken } = require("../controllers/authController");
const { checkBody, asyncHandler } = require("../helpers/helper");

// read all base data in one request
router.get(
  "/get",
  authenticateToken,
  asyncHandler(async (req, res) => {
    await readBase(req, res);
  })
);
// user types
router.post(
  "/user",
  authenticateToken,
  asyncHandler(async (req, res) => {
    await createUserType(req, res);
  })
);
router.patch(
  "/user/:_id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    await updateUserType(req, res);
  })
);
router.delete(
  "/user/:_id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    await deleteUserType(req, res);
  })
);

module.exports = router;
