require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();

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
app.use("/images", express.static("images"));

app.post("/upload", upload.array("file", 5), (req, res) => {
  res.status(200).json({ message: "File upload successful" });
});

app.use("/auth", authRoutes);
app.use("/recipe", recipeRoutes);
app.use("/users", userRoutes);
app.use("/comment", commentRoutes);
app.use("/notification", notiRoutes);
app.use("/chat", chatRouter);

const startServer = async () => {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log("🚀 Server running at port:", process.env.PORT);
  });
};

startServer();
