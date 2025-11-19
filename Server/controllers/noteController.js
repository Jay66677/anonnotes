// server/controllers/noteController.js
import AnonNote from "../models/AnonNote.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import GeminiClient from "../utils/GeminiClient.js";

// Upload AnonNote (text + media URLs)
export async function createNote(req, res, next) {
  try {
    const { text, imageUrl, videoUrl } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const note = await AnonNote.create({
      text,
      media: {
        imageUrl: imageUrl || undefined,
        videoUrl: videoUrl || undefined,
      },
      author: req.user.id,
    });

    await User.incrementUploaded(req.user.id);

    res.status(201).json({
      id: note._id,
      text: note.text,
      media: note.media,
      createdAt: note.createdAt,
      likeCount: note.likeCount,
    });
  } catch (err) {
    next(err);
  }
}

// Public feed — pagination
export async function getAllNotes(req, res, next) {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const notes = await AnonNote.find({ isRemoved: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      notes: notes.map((n) => ({
        id: n._id,
        text: n.text,
        media: n.media,
        createdAt: n.createdAt,
        likeCount: n.likeCount,
        moodLabel: n.moodLabel,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// Most liked (Home page)
export async function getMostLiked(req, res, next) {
  try {
    const limit = parseInt(req.query.limit || "5", 10);

    const notes = await AnonNote.find({ isRemoved: false })
      .sort({ likeCount: -1, createdAt: -1 })
      .limit(limit);

    res.json({
      notes: notes.map((n) => ({
        id: n._id,
        text: n.text,
        media: n.media,
        createdAt: n.createdAt,
        likeCount: n.likeCount,
        moodLabel: n.moodLabel,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// Most recent (Home page)
export async function getMostRecent(req, res, next) {
  try {
    const limit = parseInt(req.query.limit || "5", 10);

    const notes = await AnonNote.find({ isRemoved: false })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      notes: notes.map((n) => ({
        id: n._id,
        text: n.text,
        media: n.media,
        createdAt: n.createdAt,
        likeCount: n.likeCount,
        moodLabel: n.moodLabel,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// Like toggle button
export async function toggleLike(req, res, next) {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    const note = await AnonNote.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const alreadyLiked = note.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // Unlike
      note.likes = note.likes.filter(id => id.toString() !== userId.toString());
      note.likeCount = Math.max(0, note.likeCount - 1);

      await User.findByIdAndUpdate(userId, {
        $pull: { likedNotes: note._id },
        $inc: { "stats.likedCount": -1 }
      });
    } else {
      // Like
      note.likes.push(userId);
      note.likeCount = note.likeCount + 1;

      await User.findByIdAndUpdate(userId, {
        $addToSet: { likedNotes: note._id },
        $inc: { "stats.likedCount": 1 }
      });
    }

    await note.save();

    res.json({
      id: note._id,
      likeCount: note.likeCount,
      likedByCurrentUser: !alreadyLiked
    });

  } catch (err) {
    next(err);
  }
}


// My uploads
export async function getMyNotes(req, res, next) {
  try {
    const notes = await AnonNote.find({
      author: req.user.id,
      isRemoved: false,
    }).sort({ createdAt: -1 });

    res.json({
      notes: notes.map((n) => ({
        id: n._id,
        text: n.text,
        media: n.media,
        createdAt: n.createdAt,
        likeCount: n.likeCount,
        moodLabel: n.moodLabel,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// Report a note to admin
export async function reportNote(req, res, next) {
  try {
    const { reason } = req.body;
    const noteId = req.params.id;

    await Report.create({
      note: noteId,
      reportedBy: req.user.id,
      reason: reason || "hateful or abusive content",
    });

    await AnonNote.findByIdAndUpdate(noteId, {
      $inc: { reportsCount: 1 },
    });

    res.json({ message: "Report submitted" });
  } catch (err) {
    next(err);
  }
}

// Mood detection from Gemini API
export async function detectMood(req, res, next) {
  try {
    const noteId = req.params.id;
    const note = await AnonNote.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const label = await GeminiClient.detectMood(note.text);
    note.moodLabel = label;
    await note.save();

    res.json({ mood: label });
  } catch (err) {
    next(err);
  }
}
