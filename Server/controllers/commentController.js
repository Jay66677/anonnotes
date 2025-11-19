// server/controllers/commentController.js
import Comment from "../models/Comment.js";
import AnonNote from "../models/AnonNote.js";

export async function addComment(req, res, next) {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const note = await AnonNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Comment.create({
      note: note._id,
      author: req.user.id,
      text
    });

    res.status(201).json({ message: "Comment added" });
  } catch (err) {
    next(err);
  }
}

export async function getComments(req, res, next) {
  try {
    const comments = await Comment.find({ note: req.params.id })
      .sort({ createdAt: -1 });

    res.json({
      comments: comments.map(c => ({
        id: c._id,
        text: c.text,
        createdAt: c.createdAt,
      }))
    });
  } catch (err) {
    next(err);
  }
}
