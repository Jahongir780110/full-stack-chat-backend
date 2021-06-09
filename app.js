const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");

const chatRoutes = require("./routes/chat");
const authRoutes = require("./routes/auth");

const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.syzlo.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const app = express();

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  let data = null;
  if (error.data) {
    data = error.data;
  }
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("yahooo, connected to database!");
    const server = app.listen(process.env.PORT || 3000);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));
