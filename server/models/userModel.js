const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  isDeleted: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    middleName: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    contactNumber: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      required: true,
    },
    profileImage: { type: String },
    failedAttempts: { type: Number, default: 0 },
    lockoutUntil: { type: Date, default: null },
    status: { type: StatusSchema, required: false },
    lastLogin: { type: Date, default: null },
    loginHistory: [
      {
        ip: String,
        device: String,
        os: String,
        browser: String,
        loginTime: Date,
      },
    ],
  },

  { timestamps: true },
  { versionKey: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
