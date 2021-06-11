const Message = require("../models/message");
const io = require("../socket");

exports.getMessages = (req, res, next) => {
  Message.find()
    .populate("author")
    .populate({
      path: "repliedMessage",
      populate: {
        path: "author",
      },
    })
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
  const repliedMessage = req.body.repliedMessage;

  const message = new Message({
    content,
    author,
    color,
    edited: false,
    repliedMessage,
  });

  message
    .save()
    .then((message) => {
      return message
        .populate("author")
        .populate({
          path: "repliedMessage",
          populate: {
            path: "author",
          },
        })
        .execPopulate();
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
      return Message.find()
        .populate("author")
        .populate({
          path: "repliedMessage",
          populate: {
            path: "author",
          },
        });
    })
    .then((messages) => {
      io.getIO().emit("messages", { action: "edit", messages: messages });
      res.status(200).json({
        message: "Successfully edited message )",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteMessage = (req, res, next) => {
  const messageId = req.query.messageId;
  Message.findByIdAndRemove(messageId)
    .then((data) => {
      if (!data) {
        const error = new Error("Could not find message.");
        error.statusCode = 404;
        throw error;
      }
      Message.find()
        .populate("author")
        .populate({
          path: "repliedMessage",
          populate: {
            path: "author",
          },
        })
        .then((messages) => {
          io.getIO().emit("messages", { action: "delete", messages: messages });
          res.status(200).json({
            message: "Successfully deleted message )",
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
