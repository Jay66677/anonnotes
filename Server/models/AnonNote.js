// server/models/AnonNote.js
import mongoose from "mongoose";

const anonNoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    media: {
      imageUrl: { type: String },
      videoUrl: { type: String },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false, // keep identity hidden by default
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    moodLabel: {
      type: String,
    },
    aiVersion: {
      type: String,
    },
    reportsCount: {
      type: Number,
      default: 0,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// ES6 Class for like toggle (project requirement)
class AnonNoteClass {
  static async toggleLike(noteId, userId) {
    const note = await this.findById(noteId);
    if (!note) return null;

    const userStr = userId.toString();
    const alreadyLiked = note.likes.some(
      (id) => id.toString() === userStr
    );

    if (alreadyLiked) {
      note.likes = note.likes.filter((id) => id.toString() !== userStr);
      note.likeCount = Math.max(0, note.likeCount - 1);
    } else {
      note.likes.push(userId);
      note.likeCount = note.likeCount + 1;
    }

    return note.save();
  }
}

anonNoteSchema.loadClass(AnonNoteClass);

const AnonNote = mongoose.model("AnonNote", anonNoteSchema);
export default AnonNote;
