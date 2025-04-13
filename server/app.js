require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./configs/db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cookieParser());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.get("/luntian/api", (req, res) => {
  res.send("LUNTIAN BACKEND IS RUNNING");
});

//routes
const authRoutes = require("./routes/authRoutes");
const baseRoutes = require("./routes/baseRoutes");
const userRoutes = require("./routes/userRoutes");
const detectRoutes = require("./routes/detectRoutes")

app.use("/luntian/api/auth", authRoutes);
app.use("/luntian/api/user", userRoutes);
app.use("/luntian/api/base", baseRoutes);
app.use("/luntian/api/detect", detectRoutes);


//MongoDB connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
