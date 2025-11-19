// client/src/pages/MyAnonNotesPage.jsx
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoteListSection from "../components/NoteListSection";

function MyAnonNotesPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-neonCyan">My AnonNotes</h2>
      <NoteListSection title="Notes You Uploaded" type="mine" />
    </div>
  );
}

export default MyAnonNotesPage;
