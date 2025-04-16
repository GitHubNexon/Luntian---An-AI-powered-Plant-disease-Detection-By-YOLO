require("dotenv").config();
const axios = require("axios");
const User = require("../models/userModel");
const DetectModel = require("../models/detectModel");
const { OpenAI } = require("openai");
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const createDetection = async (req, res) => {
  try {
    const { plantName, description, images, status, createdBy } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res
        .status(400)
        .json({ error: "An array of base64 image strings is required" });
    }

    const baseURL = process.env.ROBOFLOW_MODEL_URL;
    const apiKey = process.env.ROBOFLOW_API_KEY;

    const annotatedImages = [];
    const results = [];

    for (const image of images) {
      const jsonResponse = await axios.post(
        `${baseURL}?api_key=${apiKey}&format=json`,
        image,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const imageResponse = await axios.post(
        `${baseURL}?api_key=${apiKey}&format=image&labels=on&confidence=0&max_predictions=20`,
        image,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          responseType: "arraybuffer",
        }
      );

      const base64AnnotatedImage = `data:image/jpeg;base64,${Buffer.from(
        imageResponse.data,
        "binary"
      ).toString("base64")}`;

      annotatedImages.push(base64AnnotatedImage);
      results.push(jsonResponse.data);
    }

    // Extract unique disease names
    const diseaseSet = new Set();
    results.forEach((result) => {
      result.predictions?.forEach((prediction) => {
        if (prediction.class) {
          diseaseSet.add(prediction.class);
        }
      });
    });

    const diseaseNames = Array.from(diseaseSet);
    const info = [];

    for (const disease of diseaseNames) {
      const messages = [
        {
          role: "system",
          content: `You are Luntian, an assistant designed to support users in understanding and managing plant diseases. Provide a response strictly in JSON format with the following fields:
          {
            "diseaseDescription": "single string",
            "plantsAffected": ["array", "of", "strings"],
            "causesAndRiskFactors": ["array", "of", "strings"],
            "treatmentAndManagement": ["array", "of", "strings"],
            "importantNotes": "single string"
          }`,
        },
        {
          role: "user",
          content: disease,
        },
      ];

      const response = await openai.chat.completions.create({
        model: "llama3-70b-8192",
        messages,
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      info.push(parsed);
    }

    const detection = await DetectModel.create({
      plantName,
      description,
      status,
      images: annotatedImages,
      results,
      info,
      createdBy,
    });

    res.status(201).json({ message: "Detection created", data: detection });
  } catch (error) {
    console.error("Detection Error:", error.message);
    res.status(500).json({ error: "Detection failed", details: error.message });
  }
};

const updateDetection = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedDetection = await DetectModel.findById(id);

    if (!updatedDetection) {
      return res.status(404).json({ error: "Detection not found" });
    }

    let info = updatedDetection.info; // fallback to existing info unless recalculated

    // ✅ If new images are provided, re-process them
    if (
      updatedData.images &&
      Array.isArray(updatedData.images) &&
      updatedData.images.length > 0
    ) {
      const baseURL = process.env.ROBOFLOW_MODEL_URL;
      const apiKey = process.env.ROBOFLOW_API_KEY;

      const annotatedImages = [];
      const results = [];

      for (const image of updatedData.images) {
        const jsonResponse = await axios.post(
          `${baseURL}?api_key=${apiKey}&format=json`,
          image,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const imageResponse = await axios.post(
          `${baseURL}?api_key=${apiKey}&format=image&labels=on&confidence=0&max_predictions=20`,
          image,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            responseType: "arraybuffer",
          }
        );

        const base64AnnotatedImage = `data:image/jpeg;base64,${Buffer.from(
          imageResponse.data,
          "binary"
        ).toString("base64")}`;

        annotatedImages.push(base64AnnotatedImage);
        results.push(jsonResponse.data);
      }

      updatedDetection.images = annotatedImages;
      updatedDetection.results = results;

      // 🔍 Extract disease classes and fetch new info from LLM
      const diseaseSet = new Set();
      results.forEach((result) => {
        result.predictions?.forEach((pred) => {
          if (pred.class) diseaseSet.add(pred.class);
        });
      });

      const diseaseNames = Array.from(diseaseSet);
      info = [];

      for (const disease of diseaseNames) {
        const messages = [
          {
            role: "system",
            content: `You are Luntian, an assistant designed to support users in understanding and managing plant diseases. Provide a response strictly in JSON format with the following fields:
            {
              "diseaseDescription": "single string",
              "plantsAffected": ["array", "of", "strings"],
              "causesAndRiskFactors": ["array", "of", "strings"],
              "treatmentAndManagement": ["array", "of", "strings"],
              "importantNotes": "single string"
            }`,
          },
          { role: "user", content: disease },
        ];

        const response = await openai.chat.completions.create({
          model: "llama3-70b-8192",
          messages,
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        info.push(parsed);
      }
    }

    // ✅ Update non-image fields
    Object.keys(updatedData).forEach((key) => {
      if (key !== "images" && key !== "results" && key !== "info") {
        if (key === "status" && typeof updatedData.status === "object") {
          updatedDetection.status = {
            isDeleted:
              updatedData.status.isDeleted ??
              updatedDetection.status?.isDeleted ??
              false,
            isArchived:
              updatedData.status.isArchived ??
              updatedDetection.status?.isArchived ??
              false,
          };
        } else {
          updatedDetection[key] = updatedData[key];
        }
      }
    });

    // If info was recalculated, update it
    if (info) {
      updatedDetection.info = info;
    }

    await updatedDetection.save();

    res.status(200).json({
      message: "Update Detection Successfully",
      updatedDetection,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};

const getAllDetection = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const keyword = req.query.keyword || "";
    const status = req.query.status;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? -1 : 1;

    const query = {
      ...(keyword && {
        $or: [
          { plantName: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      }),
      ...(status === "isDeleted" && { "status.isDeleted": true }),
      ...(status === "isArchived" && { "status.isArchived": true }),
    };

    const sortCriteria = {
      "status.isDeleted": 1,
      "status.isArchived": 1,
      [sortBy]: sortOrder,
    };

    const totalItems = await DetectModel.countDocuments(query);
    const detections = await DetectModel.find(query)
      .populate("createdBy")
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      detections: detections,
    });
  } catch (error) {
    console.error("Error in get all Detections:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const softDeleteDetection = async (req, res) => {
  try {
    const { id } = req.params;

    const detectionRecord = await DetectModel.findById(id);
    if (!detectionRecord || !detectionRecord.status) {
      return res
        .status(404)
        .json({ message: "Detection record or status not found" });
    }
    if (detectionRecord.status.isArchived) {
      return res
        .status(400)
        .json({ message: "Cannot delete an archived detection record." });
    }

    if (detectionRecord.status.isDeleted) {
      return res
        .status(400)
        .json({ message: "Detection record is already deleted." });
    }

    const updatedDetection = await DetectModel.findByIdAndUpdate(
      id,
      { "status.isDeleted": true },
      { new: true }
    );

    if (!updatedDetection) {
      return res.status(404).json({ message: "Detection record not found" });
    }

    res.status(200).json(updatedDetection);
  } catch (error) {
    console.error(
      "Error deleting detection record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};

const softArchiveDetection = async (req, res) => {
  try {
    const { id } = req.params;

    const detectionRecord = await DetectModel.findById(id);
    if (!detectionRecord || !detectionRecord.status) {
      return res
        .status(404)
        .json({ message: "Detection record or status not found" });
    }
    if (detectionRecord.status.isDeleted) {
      return res
        .status(400)
        .json({ message: "Cannot archive a deleted detection record." });
    }

    if (detectionRecord.status.isArchived) {
      return res
        .status(400)
        .json({ message: "Detection record is already archived." });
    }

    const updatedDetection = await DetectModel.findByIdAndUpdate(
      id,
      { "status.isArchived": true },
      { new: true }
    );

    if (!updatedDetection) {
      return res.status(404).json({ message: "Detection record not found" });
    }

    res.status(200).json(updatedDetection);
  } catch (error) {
    console.error(
      "Error archiving detection record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};

const undoDeleteDetection = async (req, res) => {
  try {
    const { id } = req.params;

    const detectionRecord = await DetectModel.findById(id);
    if (!detectionRecord || !detectionRecord.status) {
      return res
        .status(404)
        .json({ message: "Detection record or status not found" });
    }
    if (!detectionRecord.status.isDeleted) {
      return res
        .status(400)
        .json({ message: "Detection record is not deleted." });
    }

    const updatedDetection = await DetectModel.findByIdAndUpdate(
      id,
      { "status.isDeleted": false },
      { new: true }
    );

    if (!updatedDetection) {
      return res.status(404).json({ message: "Detection record not found" });
    }

    res.status(200).json(updatedDetection);
  } catch (error) {
    console.error(
      "Error undoing delete on detection record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};

const undoArchiveDetection = async (req, res) => {
  try {
    const { id } = req.params;

    const detectionRecord = await DetectModel.findById(id);
    if (!detectionRecord || !detectionRecord.status) {
      return res
        .status(404)
        .json({ message: "Detection record or status not found" });
    }
    if (!detectionRecord.status.isArchived) {
      return res
        .status(400)
        .json({ message: "Detection record is not archived." });
    }
    if (detectionRecord.status.isDeleted) {
      return res.status(400).json({
        message: "Cannot undo archive for a deleted detection record.",
      });
    }

    const updatedDetection = await DetectModel.findByIdAndUpdate(
      id,
      { "status.isArchived": false },
      { new: true }
    );

    if (!updatedDetection) {
      return res.status(404).json({ message: "Detection record not found" });
    }

    res.status(200).json(updatedDetection);
  } catch (error) {
    console.error(
      "Error undoing archive on detection record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};

const permanentDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteDetections = await DetectModel.findByIdAndDelete(id);
    if (!deleteDetections) {
      return res.status(404).json({ message: "detections not found" });
    }
    res.json({ message: "detections deleted successfully" });
  } catch (error) {
    console.error("Error deleting detections:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createDetection,
  updateDetection,
  getAllDetection,
  softDeleteDetection,
  softArchiveDetection,
  undoDeleteDetection,
  undoArchiveDetection,
  permanentDelete,
};
