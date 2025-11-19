// client/src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ApiClient from "../services/ApiClient";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      navigate("/");
      return;
    }
    fetchAdminData();
  }, [isLoggedIn, role, navigate]);

  async function fetchAdminData() {
    try {
      setLoading(true);

      const statsRes = await ApiClient.get("/admin/stats");
      const reportsRes = await ApiClient.get("/admin/reports");

      setStats(statsRes);
      setReports(reportsRes.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveNote(noteId) {
    if (!confirm("Eliminate this note from the ship?")) return;

    try {
      await ApiClient.delete(`/admin/remove-note/${noteId}`);
      await fetchAdminData();
      alert("Note eliminated.");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemoveUser(userId) {
    if (!confirm("Exile this user? All their notes will be removed.")) return;

    try {
      await ApiClient.delete(`/admin/remove-user/${userId}`);
      await fetchAdminData();
      alert("User exiled.");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <p className="fade-in text-center mt-10 opacity-70 text-lg">
        Booting admin console...
      </p>
    );
  }

  return (
    <div className="admin-console fade-in max-w-2xl mx-auto">
      {/* Header */}
      <header className="admin-header mb-8">
        <p className="admin-label text-sm">IMPOSTER ACCESS GRANTED</p>
        <h1 className="admin-title text-2xl">ANONNOTES CONTROL PANEL</h1>
        <p className="admin-subtitle">Crew vitals, anomalies, and ejection controls</p>
      </header>

      {/* Stats */}
      {stats && (
        <section className="stats-hud mb-6">
          <div className="stat-box"><p className="label">Active Users</p><p className="value">{stats.users}</p></div>
          <div className="stat-box"><p className="label">Active Notes</p><p className="value">{stats.notes}</p></div>
          <div className="stat-box stat-alert">
            <p className="label">Pending Reports</p>
            <p className="value">{stats.reportsPending}</p>
          </div>
        </section>
      )}

      {/* Reports */}
      <section className="report-console">
        <h2 className="sub-header text-base">REPORT QUEUE</h2>

        {reports.length === 0 ? (
          <p className="no-alert text-base">No anomalies detected. The ship is quiet.</p>
        ) : (
          <div className="report-list">
            {reports.map((rep) => (
              <div key={rep.id} className="report-card text-base">
                <p className="report-field">
                  <span className="field-label">Reason:</span> {rep.reason}
                </p>
                <p className="report-field">
                  <span className="field-label">Note Preview:</span>{" "}
                  {rep.note?.text
                    ? rep.note.text.slice(0, 120) + (rep.note.text.length > 120 ? "..." : "")
                    : "Note removed or unavailable"}
                </p>
                <p className="report-field">
                  <span className="field-label">Created:</span>{" "}
                  {new Date(rep.createdAt).toLocaleString()}
                </p>

                <div className="report-actions">
                  {rep.note?.id && (
                    <button className="btn-danger" onClick={() => handleRemoveNote(rep.note.id)}>
                      Eliminate Note
                    </button>
                  )}
                  {rep.reportedBy && (
                    <button className="btn-outline" onClick={() => handleRemoveUser(rep.reportedBy)}>
                      Exile User
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminPage;
