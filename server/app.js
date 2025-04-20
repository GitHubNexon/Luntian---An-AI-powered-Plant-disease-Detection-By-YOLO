require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./configs/db");
const http = require("http");
const { Server } = require("socket.io");
const initSocket = require("./socket");

const app = express();
const PORT = process.env.PORT || 3001;

// Convert comma-separated origins into an array
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

app.use(cookieParser());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    // origin: [
    //   "http://localhost:5173",
    //   "http://localhost:3000",
    //   "http://192.168.100.2:5173" // this can be any ip address - can change any time
    // ],
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// // Create an HTTP server
// const server = http.createServer(app);
// // Initialize Socket.IO with the server
// const io = initSocket(server);

app.use(express.json());
app.get("/luntian/api", (req, res) => {
  res.send("LUNTIAN BACKEND IS RUNNING");
});

//routes
const authRoutes = require("./routes/authRoutes");
const baseRoutes = require("./routes/baseRoutes");
const userRoutes = require("./routes/userRoutes");
const detectRoutes = require("./routes/detectRoutes");
const chatRoutes = require("./routes/chatRoutes");
const externalApiRoutes = require("./routes/externalApiRoutes");

app.use("/luntian/api/auth", authRoutes);
app.use("/luntian/api/user", userRoutes);
app.use("/luntian/api/base", baseRoutes);
app.use("/luntian/api/detect", detectRoutes);
app.use("/luntian/api/chat", chatRoutes);
app.use("/luntian/api/external-api", externalApiRoutes);

//MongoDB connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
