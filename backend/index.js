import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import bcrypt from "bcrypt";
import archiver from "archiver";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import File from "./models/File.js";
import { sendFileEmail } from "./utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

/* Upload folder */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
app.use("/uploads", express.static("uploads"));

/* MongoDB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ---------------- AUTH MIDDLEWARE ---------------- */
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
}

/* ---------------- AUTH ---------------- */

/* SIGNUP */
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      email,
      password: hashedPassword,
      provider: "local"
    });

    await user.save();

    res.json({ message: "User created successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* LOGIN */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GOOGLE LOGIN */
app.post("/api/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        avatar: picture,
        provider: "google"
      });
    } else {
      user.name = name;
      user.avatar = picture;
      user.provider = "google";
    }

    await user.save();

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token: jwtToken });

  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

/* PROFILE */
app.get("/api/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

/* ---------------- MULTER ---------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ---------------- UPLOAD ---------------- */

app.post("/api/upload", auth, upload.array("files"), async (req, res) => {
  try {
    const groupId = uuidv4();

    const files = req.files.map(file => ({
      userId: req.user.id,
      groupId,
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }));

    await File.insertMany(files);

    res.json({ groupId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- PRIVATE FILES ---------------- */

app.get("/api/files", auth, async (req, res) => {
  const files = await File.find({ userId: req.user.id })
    .sort({ uploadDate: -1 });

  res.json(files);
});

/* DELETE (SECURE) */
app.delete("/api/files/:id", auth, async (req, res) => {

  const file = await File.findById(req.params.id);

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  if (file.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const filePath = `uploads/${file.filename}`;

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await File.findByIdAndDelete(req.params.id);

  res.json({ message: "Deleted" });
});

/* ANALYTICS (USER ONLY) */
app.get("/api/analytics", auth, async (req, res) => {
  const files = await File.find({ userId: req.user.id });
  res.json(files);
});

/* ---------------- PUBLIC SHARING ---------------- */

app.get("/api/download-zip/:groupId", async (req, res) => {

  const files = await File.find({ groupId: req.params.groupId });

  if (!files.length) {
    return res.status(404).json({ message: "Files not found" });
  }

  const verified = req.query.verified === "true";

  // 🔐 PASSWORD CHECK
  if (files[0].password && !verified) {
    return res.status(403).json({ message: "Password required" });
  }

  const archive = archiver("zip");
  res.attachment("files.zip");
  archive.pipe(res);

  files.forEach(file => {
    archive.file(`uploads/${file.filename}`, {
      name: file.originalname
    });
  });

  archive.finalize();

});
//NEW
app.post("/api/verify-password/:groupId", async (req, res) => {

  const { password } = req.body;

  const file = await File.findOne({
    groupId: req.params.groupId
  });

  if (!file) {
    return res.status(404).json({ success: false });
  }

  if (!file.password) {
    return res.json({ success: true });
  }

  const match = await bcrypt.compare(password, file.password);

  res.json({ success: match });

});
/* PUBLIC FILE INFO */
app.get("/api/public-files/:groupId", async (req, res) => {
  const files = await File.find({ groupId: req.params.groupId });
  console.log("FILES SENT: ", files) //Remove this later
  res.json(files);
});

/* PASSWORD (OWNER ONLY) */
app.post("/api/set-password/:groupId", auth, async (req, res) => {

  const files = await File.find({ groupId: req.params.groupId });

  if (!files.length) return res.status(404).json({});

  if (files[0].userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const hashed = await bcrypt.hash(req.body.password, 10);

  await File.updateMany(
    { groupId: req.params.groupId },
    { password: hashed }
  );

  res.json({ message: "Password set" });
});

/* EMAIL */
app.post("/api/send-email", async (req, res) => {
  const { email, groupId } = req.body;

  const files = await File.find({ groupId });

  const link = `http://localhost:5173/download/${groupId}`;

  await sendFileEmail(email, files[0].originalname, link);

  res.json({ message: "Email sent" });
});

/* ---------------- START ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});