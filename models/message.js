const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    edited: {
      type: Boolean,
      required: true,
    },
    repliedMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
