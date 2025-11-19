// client/src/components/AnonNoteCard.jsx
import { useState } from "react";
import ApiClient from "../services/ApiClient";
import { useAuth } from "../context/AuthContext";
import CommentList from "./CommentList";

function AnonNoteCard({ note }) {
  const { isLoggedIn } = useAuth();

  const [likeCount, setLikeCount] = useState(note.likeCount || 0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mood, setMood] = useState(note.moodLabel || null);
  const [reported, setReported] = useState(false);
  const [showComments, setShowComments] = useState(false);

  async function handleLike() {
    if (!isLoggedIn) return alert("Login required to like");
    try {
      const res = await ApiClient.post(`/notes/${note.id}/like`);
      setLiked(res.likedByCurrentUser);
      setLikeCount(res.likeCount);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave() {
    if (!isLoggedIn) return alert("Login required to save");
    try {
      const res = await ApiClient.post(`/profile/save/${note.id}`);
      setSaved(res.saved);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMood() {
    if (!isLoggedIn) return alert("Login required for mood detection");
    try {
      const res = await ApiClient.post(`/notes/${note.id}/mood`);
      setMood(res.mood);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReport() {
    if (!isLoggedIn) return alert("Login required to report");
    try {
      await ApiClient.post(`/notes/${note.id}/report`, {
        reason: "Reported: abusive or inappropriate",
      });
      setReported(true);
      alert("Report submitted for admin review");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="card-dark fade-in border border-neonCyan shadow-lg p-5 rounded-lg max-w-2xl mx-auto text-base">

      {/* Timestamp */}
      <p className="text-xs opacity-50 mb-2">
        {new Date(note.createdAt).toLocaleString()}
      </p>

      {/* Text */}
      <p className="mb-4 whitespace-pre-wrap leading-relaxed">
        {note.text}
      </p>

      {/* Media */}
      {note.media?.imageUrl && (
        <img
          src={note.media.imageUrl}
          alt="Anon media"
          className="rounded-card mb-4 w-full object-cover max-h-[350px]"
        />
      )}

      {note.media?.videoUrl && (
        <video
          controls
          className="rounded-card mb-4 w-full max-h-64"
          src={note.media.videoUrl}
        />
      )}

      {/* Mood */}
      {mood && (
        <span className="text-sm text-neonCyan opacity-80 block mb-3">
          Mood Detected: <strong>{mood}</strong>
        </span>
      )}

      {/* Action buttons */}
      <div className="flex items-center flex-wrap gap-4 mt-3">

        <button
          className={`icon-btn ${liked ? "text-imposterRed" : ""}`}
          onClick={handleLike}
        >
          ▲ {likeCount}
        </button>

        <button
          className={`icon-btn ${saved ? "text-neonCyan" : ""}`}
          onClick={handleSave}
        >
          ✦ Save
        </button>

        <button className="icon-btn" onClick={handleMood}>
          Analyze
        </button>

        <button className="icon-btn" onClick={() => setShowComments(v => !v)}>
          {showComments ? "Hide" : "Comments"}
        </button>

        <button
          className={`icon-btn text-alert ${reported ? "opacity-40" : ""}`}
          disabled={reported}
          onClick={handleReport}
        >
          Report
        </button>
      </div>

      {/* Comments */}
      {showComments && <CommentList noteId={note.id} />}
    </div>
  );
}

export default AnonNoteCard;
