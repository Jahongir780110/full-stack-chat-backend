const Message = require("../models/message");
const io = require("../socket");

exports.getMessages = (req, res, next) => {
  Message.find()
    .populate("author")
    .then((messages) => {
      res.status(200).json({
        message: "Success!!!",
        data: messages,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postMessage = (req, res, next) => {
  const content = req.body.content;
  const author = req.body.author;
  const color = req.body.color;

  const message = new Message({
    content,
    author,
    color,
    edited: false,
  });

  message
    .save()
    .then((message) => {
      return message.populate("author").execPopulate();
    })
    .then((message) => {
      io.getIO().emit("messages", { action: "create", message: message });
      res.status(201).json({
        message: "Message Successfully created",
        data: message,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editMessage = (req, res, next) => {
  const content = req.body.content;
  const messageId = req.body.messageId;
  Message.findById(messageId)
    .then((message) => {
      if (!message) {
        const error = new Error("Could not find message.");
        error.statusCode = 404;
        throw error;
      }
      message.content = content;
      message.edited = true;
      return message.save();
    })
    .then((data) => {
      res.status(200).json({ message: "Post edited.", editedMessage: data });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteMessage = (req, res, next) => {
  const messageId = req.params.messageId;
  Message.findByIdAndRemove(messageId)
    .then((data) => {
      if (!data) {
        const error = new Error("Could not find message.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Successfully deleted message )",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
