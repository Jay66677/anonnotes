// client/src/pages/AnonNotesPage.jsx
import NoteListSection from "../components/NoteListSection";

function AnonNotesPage() {
  return (
    <div className="fade-in depth-box max-w-2xl mx-auto">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-neonCyan">All AnonNotes</h2>
        <p className="opacity-60 text-base">Browse what others anonymously shared...</p>
      </header>

      <NoteListSection title="Recent Posts" type="feed" />
    </div>
  );
}

export default AnonNotesPage;
