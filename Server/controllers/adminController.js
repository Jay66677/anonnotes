// server/controllers/adminController.js
import User from "../models/User.js";
import AnonNote from "../models/AnonNote.js";
import Report from "../models/Report.js";

// Admin: View all reports
export async function getReports(req, res, next) {
  try {
    const reports = await Report.find()
      .populate("note")
      .select("+reportedBy"); // admin can reveal identity

    res.json({
      reports: reports.map((r) => ({
        id: r._id,
        note: r.note
          ? {
              id: r.note._id,
              text: r.note.text,
              media: r.note.media,
              createdAt: r.note.createdAt,
              likeCount: r.note.likeCount,
            }
          : null,
        reportedBy: r.reportedBy,
        reason: r.reason,
        status: r.status,
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// Admin: Soft delete a note
export async function removeNote(req, res, next) {
  try {
    const noteId = req.params.id;

    const note = await AnonNote.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.isRemoved = true;
    await note.save();

    await Report.updateMany(
      { note: noteId },
      { status: "action_taken" }
    );

    res.json({ message: "Note removed successfully" });
  } catch (err) {
    next(err);
  }
}

// Admin: Remove user entirely
export async function removeUser(req, res, next) {
  try {
    const userId = req.params.id;

    await User.findByIdAndDelete(userId);
    await AnonNote.updateMany(
      { author: userId },
      { isRemoved: true }
    );
    await Report.updateMany(
      { reportedBy: userId },
      { status: "reviewed" }
    );

    res.json({ message: "User account deleted" });
  } catch (err) {
    next(err);
  }
}

// Admin stats
export async function adminStats(req, res, next) {
  try {
    const users = await User.countDocuments();
    const notes = await AnonNote.countDocuments({ isRemoved: false });
    const reportsPending = await Report.countDocuments({
      status: "pending",
    });

    res.json({ users, notes, reportsPending });
  } catch (err) {
    next(err);
  }
}
