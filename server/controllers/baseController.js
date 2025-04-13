const { baseModel } = require("../models/baseModel");
const mongoose = require("mongoose");


async function readBase(req, res) {
  try {
    const base = await baseModel.findOne();
    if (!base) return res.status(404).json({ message: "base data not found" });
    res.status(200).json(base);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getBase() {
  try {
    const base = await baseModel.findOne();
    return base;
  } catch (error) {
    console.error("Error trying to read base data");
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createUserType(req, res) {
  try {
    await baseModel.updateMany(
      {},
      { $push: { userTypes: req.body } },
      { new: true }
    );
    res.json({ message: "User type created" });
  } catch (error) {
    console.error("Error on inserting new user type");
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUserType(req, res) {
  try {
    const _id = mongoose.Types.ObjectId.createFromHexString(req.params._id);
    await baseModel.updateMany(
      { "userTypes._id": _id },
      { $set: { "userTypes.$": req.body } }
    );
    res.json({ message: "User type updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteUserType(req, res) {
  try {
    await baseModel.updateMany(
      {},
      {
        $pull: { userTypes: req.params },
      }
    );
    res.json({ message: "User type deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  readBase,
  getBase,
  createUserType,
  updateUserType,
  deleteUserType,
};
