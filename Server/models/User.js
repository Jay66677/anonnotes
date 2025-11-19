// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 40,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    likedNotes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "AnonNote" }
    ],
    savedNotes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "AnonNote" }
    ],
    stats: {
      uploadedCount: { type: Number, default: 0 },
      likedCount: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

// Correct password check — RAW password compared against stored hash
userSchema.methods.matchPassword = async function (rawPassword) {
  return bcrypt.compare(rawPassword, this.passwordHash);
};

// ❌ Removed the pre-save hook that caused DOUBLE HASHING
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("passwordHash")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
//   next();
// });

// ES6 Class static methods
class UserClass {
  static async incrementUploaded(userId) {
    return this.findByIdAndUpdate(
      userId,
      { $inc: { "stats.uploadedCount": 1 } },
      { new: true }
    );
  }

  static async incrementLiked(userId, delta = 1) {
    return this.findByIdAndUpdate(
      userId,
      { $inc: { "stats.likedCount": delta } },
      { new: true }
    );
  }
}

userSchema.loadClass(UserClass);

const User = mongoose.model("User", userSchema);
export default User;