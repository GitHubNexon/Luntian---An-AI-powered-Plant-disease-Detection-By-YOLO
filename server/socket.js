const { Server } = require("socket.io");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://18.141.186.75:5173", // If you're accessing from another machine
        "*",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    },
  });

  return io;
};
