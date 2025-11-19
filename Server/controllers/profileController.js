// server/controllers/profileController.js
import User from "../models/User.js";
import AnonNote from "../models/AnonNote.js";

// Profile: username, email, stats, liked & saved notes
export async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "likedNotes",
        match: { isRemoved: false }
      })
      .populate({
        path: "savedNotes",
        match: { isRemoved: false }
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileData = {
      username: user.username,
      email: user.email,
      stats: user.stats,
      likedNotes: user.likedNotes.map((n) => ({
        id: n._id,
        text: n.text,
        media: n.media,
        createdAt: n.createdAt,
        likeCount: n.likeCount,
        moodLabel: n.moodLabel,
      })),
      savedNotes: user.savedNotes.map((n) => ({
        id: n._id,
        text: n.text,
        media: n.media,
        createdAt: n.createdAt,
        likeCount: n.likeCount,
        moodLabel: n.moodLabel,
      })),
    };

    res.json(profileData);
  } catch (err) {
    next(err);
  }
}

// Save / bookmark note toggle
export async function toggleSave(req, res, next) {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    const user = await User.findById(userId);

    const exists = user.savedNotes.some(
      (id) => id.toString() === noteId.toString()
    );

    if (exists) {
      user.savedNotes = user.savedNotes.filter(
        (id) => id.toString() !== noteId.toString()
      );
    } else {
      user.savedNotes.push(noteId);
    }

    await user.save();

    res.json({ saved: !exists });
  } catch (err) {
    next(err);
  }
}
