// client/src/components/NoteListSection.jsx
import { useEffect, useState } from "react";
import ApiClient from "../services/ApiClient";
import AnonNoteCard from "./AnonNoteCard";

function NoteListSection({ title, type }) {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [finished, setFinished] = useState(false);

  const pageSize = 4;

  function buildUrl(reset = false) {
    const currentPage = reset ? 1 : page;

    if (type === "mine") return `/notes/mine`;
    if (type === "most-liked") return `/notes/most-liked?limit=${pageSize}`;
    if (type === "most-recent") return `/notes/most-recent?limit=${pageSize}`;

    // feed with real pagination
    return `/notes?page=${currentPage}&limit=${pageSize}`;
  }

  async function loadNotes(reset = false) {
    try {
      const url = buildUrl(reset);
      const res = await ApiClient.get(url);

      const incoming = res.notes || [];

      // If resetting → replace notes
      if (reset) {
        setNotes(incoming);
        setPage(2);
        setFinished(incoming.length < pageSize);
        return;
      }

      // Deduplicate: avoid adding notes already present
      setNotes(prev => {
        const unique = incoming.filter(
          (n) => !prev.some((p) => p.id === n.id)
        );

        // If backend returns duplicates only → stop loading
        if (unique.length === 0) {
          setFinished(true);
          return prev;
        }

        return [...prev, ...unique];
      });

      // Next page for next click
      setPage(prev => prev + 1);

      // If backend returned fewer than pageSize → no more pages
      if (incoming.length < pageSize) {
        setFinished(true);
      }

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadNotes(true);
    // eslint-disable-next-line
  }, []);

  // Do NOT show "Load More" for static types (mine/liked/recent)
  const showLoadMore =
    type === "feed" && !finished && notes.length > 0;

  return (
    <section className="mb-10 fade-in max-w-2xl mx-auto">
      <h3 className="text-lg font-bold text-neonCyan mb-4">
        {title}
      </h3>

      <div className="grid gap-4">
        {notes.map(note => (
          <AnonNoteCard key={note.id} note={note} />
        ))}
      </div>

      {showLoadMore && (
        <button className="btn-cyan mt-4 w-full" onClick={() => loadNotes()}>
          Load More
        </button>
      )}

      {notes.length === 0 && finished && (
        <p className="text-center text-base opacity-50">Nothing to show yet.</p>
      )}
    </section>
  );
}

export default NoteListSection;
