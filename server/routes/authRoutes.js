const express = require("express");
const router = express.Router();
const {
  authenticate,
  authenticateToken,
  unlockAccount,
} = require("../controllers/authController");
const { checkBody, asyncHandler } = require("../helpers/helper");

// Login API
router.post(
  "/",
  asyncHandler(async (req, res) => {
    checkBody(["email", "password"], req, res);
    await authenticate(req, res);
  })
);

// Check Token API
router.post(
  "/check",
  authenticateToken,
  asyncHandler(async (req, res) => res.json(req.user))
);

// Logout API
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  })
);

router.post(
  "/unlock",
  authenticateToken, // Ensure the user is authenticated
  asyncHandler(async (req, res) => {
    checkBody(["email"], req, res); // Ensure email is provided in the request body
    await unlockAccount(req, res);
  })
);

module.exports = router;
