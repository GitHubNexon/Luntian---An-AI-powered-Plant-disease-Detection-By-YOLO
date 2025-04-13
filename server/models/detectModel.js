const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  isDeleted: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
});

const detectModelSchema = new mongoose.Schema(
  {
    plantName: { type: String, required: true },
    description: { type: String },
    // image: { type: String },
    images: { type: [String] },

    results: { type: mongoose.Schema.Types.Mixed },
    status: { type: StatusSchema, required: false },
  },
  { timestamps: true }
);

const DetectModel = mongoose.model("Detections", detectModelSchema);

module.exports = DetectModel;
