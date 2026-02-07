const Message = require("../models/Chat.model");
const { io } = require("../index");

/* ======================
   SEND MESSAGE
====================== */
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const message = await Message.create({
      sender: req.userId,
      receiver: receiverId,
      text,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender")
      .populate("receiver");

    // 🔥 REALTIME SOCKET
    io.emit("new-message", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: "Message send failed" });
  }
};

/* ======================
   GET MESSAGES
====================== */
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender")
      .populate("receiver");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
