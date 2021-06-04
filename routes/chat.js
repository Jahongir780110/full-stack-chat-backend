const express = require("express");

const isAuth = require("../middlewares/is-auth");
const chatController = require("../controllers/chat");

const router = express.Router();

router.get("/messages", isAuth, chatController.getMessages);

router.post("/message", isAuth, chatController.postMessage);

router.put("/message", isAuth, chatController.editMessage);

router.delete("/message", isAuth, chatController.deleteMessage);

module.exports = router;
