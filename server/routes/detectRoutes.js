const express = require("express");
const router = express.Router();
const {
  createDetection,
  updateDetection,
  getAllDetection,
  softDeleteDetection,
  softArchiveDetection,
  undoDeleteDetection,
  undoArchiveDetection,
  permanentDelete,
} = require("../controllers/detectController");
const { authenticateToken } = require("../controllers/authController");

router.post("/create/detection", authenticateToken, createDetection);

router.patch("/update/detection/:id", authenticateToken, updateDetection);

router.get("/get-all/detection", authenticateToken, getAllDetection);

router.post(
  "/soft-delete/detection/:id",
  authenticateToken,
  softDeleteDetection
);

router.post(
  "/soft-archive/detection/:id",
  authenticateToken,
  softArchiveDetection
);

router.post(
  "/undo-delete/detection/:id",
  authenticateToken,
  undoDeleteDetection
);

router.post(
  "/undo-archive/detection/:id",
  authenticateToken,
  undoArchiveDetection
);

router.delete(
  "/permanent-delete/detection/:id",
  authenticateToken,
  permanentDelete
);

module.exports = router;
