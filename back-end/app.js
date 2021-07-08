const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors")
dotenv.config();

const blocksRoutes = require("./routes/blocks");
const usersRoutes = require("./routes/users");

// Configuration where images should be stored and named
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const blockId = req.query.blockId;
      if (!blockId) {
        const err = new Error("Cannot upload image. No block id provided.");
        err.statusCode = 422;
        throw err;
      }
      const dir = `images/${blockId}`;
      fs.access(dir, (err) => {
        if (err) {
          return fs.mkdir(dir, (err) => cb(err, dir));
        } else {
          return cb(null, dir);
        }
      });
    } catch (err) {
      console.log(err);
      return cb(err, dir);
    }
  },
  filename: (req, file, cb) => {
    const hash =
      new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    cb(null, hash + "-" + file.originalname);
  },
});

// Only allow image files to be uploaded
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
if (req.method == "OPTIONS") {
  res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  return res.status(200).json({});
}

next();
});
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  multer({
    storage: fileStorage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter: fileFilter,
  }).single("image")
);
const corsOptions = {
  //To allow requests from client
  origin: [
    "http://localhost:3000",
  ],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/blocks", cors(corsOptions), blocksRoutes);
app.use("/users", usersRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message, errCode: status, data: data });
});

// ---- CHECKING SERVER STATUS ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`**** SERVER STARTED AT PORT ${PORT} ****`);
});

// ----- CHECKING IF CONNECTED WITH DATABASE OR CATCH & DISPLAY ERRORS ----
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(`**** SOMETHING WENT WRONG **** `);
  console.log(`**** UNABLE TO CONNECT WITH DATABASE ****`);
  console.log(`\n ${err}`);
});

db.once("open", () => {
  console.log("**** CONNECTED WITH DATABASE SUCCESSFULLY ****");
});
