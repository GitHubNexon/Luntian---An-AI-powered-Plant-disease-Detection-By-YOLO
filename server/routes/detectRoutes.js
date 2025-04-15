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
  startLiveDetection,
  stopLiveDetectionAPI,
  getVideoFeed,
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

router.post(
  "/live/start_live_detection",
  authenticateToken,
  startLiveDetection
);
router.post(
  "/live/stop_live_detection",
  authenticateToken,
  stopLiveDetectionAPI
);
router.get("/live/video_feed", getVideoFeed);

module.exports = router;
