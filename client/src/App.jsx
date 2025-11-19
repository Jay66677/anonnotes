import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import AnonNotesPage from "./pages/AnonNotesPage";
import MyAnonNotesPage from "./pages/MyAnonNotesPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  const location = useLocation();
  const narrowRoutes = ["/login", "/signup"];
  const isNarrow = narrowRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-neutralGray">
      <Navbar />

      {/* Tagline */}
      <p className="text-center text-neutralGray/70 text-sm mt-3 mb-4 tracking-wide">
        Speak freely. Stay unseen. Your voice, without your name.
      </p>

      <div
        className={`mx-auto px-4 py-4 fade-in ${
          isNarrow ? "max-w-md" : "max-w-2xl"
        } w-full`}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<AnonNotesPage />} />
          <Route path="/my-notes" element={<MyAnonNotesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
