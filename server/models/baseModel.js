const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const baseSchema = new mongoose.Schema({
  userTypes: [
    {
      user: { type: String, required: true, unique: true },
      access: [{ type: String }],
    },
  ],
  accessTypes: [
    { code: { type: String, unique: true }, access: { type: String } },
  ],
});

const baseModel = mongoose.model("Bases", baseSchema);

async function insertDefaultValues() {
  try {
    // Default userTypes and accessTypes should be defined outside the if block
    const defaultUserTypes = [
      { user: "Administrator", access: ["ad", "ss", "mr", "rp"] },
      { user: "Agriculturist", access: ["ad", "ss", "mr", "rp"] },
      { user: "Researcher", access: ["ad", "ss", "mr", "rp"] },
    ];

    const defaultAccessTypes = [
      { code: "ad", access: "Administrator" },
      { code: "ss", access: "Settings" },
      { code: "mr", access: "Monitoring" },
      { code: "rp", access: "Reports" },
    ];

    console.log("Checking if system default already exists...");

    const existingBase = await baseModel.findOne();

    if (existingBase) {
      console.log("Base data already exists, checking for missing data...");

      // Check for missing userTypes
      console.log("Checking userTypes...");
      for (const defaultUser of defaultUserTypes) {
        const existingUser = existingBase.userTypes.find(
          (u) => u.user === defaultUser.user
        );
        if (!existingUser) {
          console.log(`Adding missing user: ${defaultUser.user}`);
          existingBase.userTypes.push(defaultUser);
        } else {
          // Check for missing access for the user
          const missingAccess = defaultUser.access.filter(
            (access) => !existingUser.access.includes(access)
          );
          if (missingAccess.length > 0) {
            console.log(
              `Adding missing access for ${
                defaultUser.user
              }: ${missingAccess.join(", ")}`
            );
            existingUser.access.push(...missingAccess);
          }
        }
      }

      // Check for missing accessTypes
      console.log("Checking accessTypes...");
      for (const defaultAccess of defaultAccessTypes) {
        const existingAccess = existingBase.accessTypes.find(
          (a) => a.code === defaultAccess.code
        );
        if (!existingAccess) {
          console.log(`Adding missing access type: ${defaultAccess.code}`);
          existingBase.accessTypes.push(defaultAccess);
        }
      }

      console.log("Saving updated base data...");
      await existingBase.save();
      console.log(
        "Base data updated with missing users, access types, or access."
      );
      return;
    }

    console.log("Inserting system default...");

    const defaultBase = new baseModel({
      userTypes: defaultUserTypes,
      accessTypes: defaultAccessTypes,
    });

    const result = await defaultBase.save();
    console.log("System default inserted:", result);
  } catch (error) {
    console.error("Error inserting default values:", error);
  }
}

module.exports = {
  insertDefaultValues,
  baseModel,
};
