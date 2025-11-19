import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ApiClient from "../services/ApiClient";
import { useNavigate } from "react-router-dom";
import AnonNoteCard from "../components/AnonNoteCard";

function ProfilePage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return navigate("/login");
    (async () => {
      const res = await ApiClient.get("/profile");
      setProfile(res);
    })();
  }, [isLoggedIn, navigate]);

  if (!profile) {
    return <p className="text-center opacity-60 mt-10">Loading…</p>;
  }

  return (
    <div className="fade-in depth-box">

      <h2 className="text-2xl font-bold text-neonCyan mb-6">Anonymous Profile</h2>

      <section className="card-dark p-6 mb-10 text-base depth-box">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>

        <div className="divider my-4"></div>

        <p><strong>Uploaded Notes:</strong> {profile.stats?.uploadedCount}</p>
        <p><strong>Liked Notes:</strong> {profile.stats?.likedCount}</p>
        <p><strong>Saved Notes:</strong> {profile.savedNotes?.length}</p>
      </section>

      <h3 className="text-lg font-bold text-neonCyan mb-3">Saved Notes</h3>
      <div className="grid gap-4 mb-12">
        {profile.savedNotes?.map((n) => <AnonNoteCard key={n.id} note={n} />)}
      </div>

      <h3 className="text-lg font-bold text-neonCyan mb-3">Liked Notes</h3>
      <div className="grid gap-4">
        {profile.likedNotes?.map((n) => <AnonNoteCard key={n.id} note={n} />)}
      </div>
    </div>
  );
}

export default ProfilePage;
