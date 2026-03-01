require("dotenv").config();

const cors = require("cors");
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// 🔥 SOCKET SERVER
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🔥 make io accessible in controllers
app.set("io", io);

const connectDB = require("./connection");

const authRoutes = require("./routes/auth.routes");
const recipeRoutes = require("./routes/recipe.routes");
const userRoutes = require("./routes/user.routes");
const commentRoutes = require("./routes/comment.routes");
const notiRoutes = require("./routes/notifications.routes");
const upload = require("./middlewares/upload.middleware");
const chatRouter = require("./routes/chat.routes");

app.use(cors());
app.use(express.json());

// 🔥 FIX: Serve images with absolute path and proper headers
const uploadDir = process.env.UPLOAD_DIR || "images";
app.use("/images", express.static(path.join(__dirname, uploadDir), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

app.post("/upload", upload.array("file", 5), (req, res) => {
  res.status(200).json({ message: "File upload successful" });
});

app.use("/auth", authRoutes);
app.use("/recipe", recipeRoutes);
app.use("/users", userRoutes);
app.use("/comment", commentRoutes);
app.use("/notification", notiRoutes);
app.use("/chat", chatRouter);

// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ IMPORTANT FIX
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log("🚀 Server running at port:", PORT);
  });
};

startServer();
