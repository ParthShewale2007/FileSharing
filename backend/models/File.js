import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  groupId: String,

  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,

  password: String,

  downloads: {
    type: Number,
    default: 0
  },

  downloadHistory: [
    {
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  uploadDate: {
    type: Date,
    default: Date.now
  },

  expiresAt: Date

});

const File = mongoose.model("File", fileSchema);

export default File;