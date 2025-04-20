const express = require("express");
const router = express.Router();
const { getWeather } = require("../controllers/externalApiController");
const { authenticateToken } = require("../controllers/authController");

router.post("/get/open-weather", authenticateToken, getWeather);

module.exports = router;
