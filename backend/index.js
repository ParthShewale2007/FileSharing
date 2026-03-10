import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import bcrypt from "bcrypt";

import { sendFileEmail } from "./utils/sendEmail.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* Upload folder */

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use("/uploads", express.static("uploads"));

/* MongoDB */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* Schema */

const fileSchema = new mongoose.Schema({

  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,

  password: String,

  downloads: {
    type: Number,
    default: 0,
  },

  uploadDate: {
    type: Date,
    default: Date.now,
  },

});

const File = mongoose.model("File", fileSchema);

/* Multer */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },

});

const upload = multer({ storage });

/* Upload */

app.post("/api/upload", upload.array("files"), async (req, res) => {

  try {

    const files = req.files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    const savedFiles = await File.insertMany(files);

    res.json({
      fileId: savedFiles[0]._id,
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }

});

/* Set Password */

app.post("/api/set-password/:id", async (req, res) => {

  const { password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await File.findByIdAndUpdate(req.params.id, {
    password: hashed
  });

  res.json({ message: "Password saved" });

});

/* Verify Password */

app.post("/api/verify-password/:id", async (req, res) => {

  const { password } = req.body;

  const file = await File.findById(req.params.id);

  if (!file.password) {
    return res.json({ success: true });
  }

  const match = await bcrypt.compare(password, file.password);

  if (!match) {
    return res.status(403).json({
      message: "Wrong password"
    });
  }

  res.json({ success: true });

});

/* Download */

app.get("/api/download/:id", async (req, res) => {

  const file = await File.findById(req.params.id);

  if (!file) {
    return res.status(404).send("File not found");
  }

  file.downloads += 1;
  await file.save();

  const filePath = `uploads/${file.filename}`;

  res.download(filePath);

});

/* Send Email */

app.post("/api/send-email", async (req, res) => {

  const { email, fileId } = req.body;

  try {

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    const link = `http://localhost:5173/download/${fileId}`;

    await sendFileEmail(email, file.originalname, link);

    res.json({
      message: "Email sent successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Email failed"
    });

  }

});

/* File History */

app.get("/api/files", async (req, res) => {

  const files = await File.find().sort({ uploadDate: -1 });

  res.json(files);

});

/* Delete */

app.delete("/api/files/:id", async (req, res) => {

  const file = await File.findById(req.params.id);

  const path = `uploads/${file.filename}`;

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }

  await File.findByIdAndDelete(req.params.id);

  res.json({ message: "Deleted" });

});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
