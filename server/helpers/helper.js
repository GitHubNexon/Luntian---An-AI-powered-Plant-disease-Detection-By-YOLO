const multer = require("multer");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

async function checkBody(params, req, res) {
  const missingKeys = params.filter((key) => !(key in req.body));
  if (missingKeys.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required keys: ${missingKeys.join(", ")}` });
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  checkBody,
  asyncHandler,
};
