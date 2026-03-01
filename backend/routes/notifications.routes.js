const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const notificationController = require("../controllers/notifications.controller");

router.use(auth);

router.get("/", notificationController.getNotifications);
router.post("/add", notificationController.addNewNotification);

module.exports = router;
