import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ApiClient from "../services/ApiClient";
import NoteListSection from "../components/NoteListSection";

function HomePage() {
  const { isLoggedIn } = useAuth();

  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleAIRewrite(style) {
    if (!text.trim()) return;
    if (!isLoggedIn) return alert("Login required");
    try {
      setAiProcessing(true);
      const res = await ApiClient.post("/ai/rewrite", { style, text });
      setText(res.rewritten);
    } finally {
      setAiProcessing(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!isLoggedIn) return alert("Login required");
    if (!text.trim()) return alert("Text required");

    try {
      setUploading(true);

      let imageUrl = null;
      let videoUrl = null;

      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);
        const uploadRes = await ApiClient.post("/upload/media", formData, true);
        const url = uploadRes.url;

        if (mediaFile.type.startsWith("image")) imageUrl = url;
        else videoUrl = url;
      }

      await ApiClient.post("/notes", { text, imageUrl, videoUrl });
      alert("Uploaded!");
      setText("");
      setMediaFile(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fade-in feed-background">

      {/* Upload Box */}
      <section className="card-dark depth-box p-6 mb-8 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-neonCyan">Write AnonNote</h2>

        <textarea
          className="input-dark h-32 resize-none mb-4 text-base"
          placeholder="Your anonymous thoughts..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="block border border-neutralGray/60 rounded-card p-4 text-sm opacity-80 cursor-pointer hover:shadow-neonCyan transition mb-4">
          <span>{mediaFile ? mediaFile.name : "Click to upload image/video"}</span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setMediaFile(e.target.files[0])}
          />
        </label>

        <div className="flex gap-3 mb-4 flex-wrap">
          <button className="btn-cyan" disabled={aiProcessing} onClick={() => handleAIRewrite("professional")}>Professional</button>
          <button className="btn-cyan" disabled={aiProcessing} onClick={() => handleAIRewrite("funny")}>Funny</button>
          <button className="btn-cyan" disabled={aiProcessing} onClick={() => handleAIRewrite("dramatic")}>Dramatic</button>
        </div>

        <button className="btn-imposter w-full" disabled={uploading} onClick={handleUpload}>
          {uploading ? "Uploading..." : "Upload AnonNote"}
        </button>
      </section>

      <div className="divider mb-6"></div>

      <NoteListSection title="Most Liked" type="most-liked" />
      <div className="divider my-6"></div>
      <NoteListSection title="Most Recent" type="most-recent" />
    </div>
  );
}

export default HomePage;
