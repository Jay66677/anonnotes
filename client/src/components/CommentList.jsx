// client/src/components/CommentList.jsx
import { useEffect, useState } from "react";
import ApiClient from "../services/ApiClient";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Crewmate", "Imposter", "Ghost"];
const COLORS = ["cyan", "yellow", "purple", "red", "blue", "green"];

function assignRandomIdentity(commentId) {
  const role = ROLES[commentId.length % ROLES.length];
  const color = COLORS[commentId.length % COLORS.length];
  return { role, color };
}

export default function CommentList({ noteId }) {
  const { isLoggedIn } = useAuth();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  async function loadComments() {
    try {
      setLoading(true);
      const res = await ApiClient.get(`/notes/${noteId}/comments`);
      setComments(res.comments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [noteId]);

  
  async function submitComment() {
    if (!isLoggedIn) return alert("Login required to comment");
    if (!newComment.trim()) return;

    try {
      setAdding(true);
      await ApiClient.post(`/notes/${noteId}/comments`, { text: newComment });
      setNewComment("");
      loadComments();
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mt-4 p-3 border-t border-neonCyan/30">

      {loading && (
        <p className="text-xs opacity-50 mb-2">Loading comments...</p>
      )}

      {/* Comments */}
      {comments.map((c) => {
        const identity = assignRandomIdentity(c.id);
        return (
          <div
            key={c.id}
            className="mb-3 p-3 rounded bg-card/50 shadow-sm border border-neutralGray/40"
          >
            <p className={`text-xs font-bold text-${identity.color}-400`}>
              {identity.role}
            </p>
            <p className="text-base mt-1 whitespace-pre-wrap leading-relaxed">
              {c.text}
            </p>
            <p className="text-[10px] opacity-40 mt-1">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        );
      })}

      {/* Add Comment */}
      <div className="flex gap-2 mt-4">
        <input
          className="input-dark flex-1 text-base"
          placeholder="Write a comment anonymously..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!isLoggedIn}
        />
        <button
          className="btn-cyan text-sm"
          onClick={submitComment}
          disabled={adding || !isLoggedIn}
        >
          {adding ? "..." : "Post"}
        </button>
      </div>

      {!isLoggedIn && (
        <p className="text-xs opacity-40 mt-1">Login to comment</p>
      )}
    </div>
  );
}
