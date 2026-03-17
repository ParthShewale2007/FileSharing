// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({

//   email: {
//     type: String,
//     unique: true
//   },

//   password: String,

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }

// });

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    default: ""
  },

  name: {
    type: String,
    default: ""
  },

  avatar: {
    type: String,
    default: ""
  },

  provider: {
    type: String,
    default: "local"
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);