import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, role, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="w-full bg-card border-b border-neonCyan shadow-neonCyan sticky top-0 z-50">
      <div className="container mx-auto max-w-4xl flex justify-between items-center py-3 px-4">

        <Link
          to="/"
          className="text-2xl font-bold text-neonCyan hover:shadow-neonCyan"
        >
          ANONNOTES
        </Link>

        <div className="hidden sm:flex items-center gap-6 font-semibold text-base">
          <Link to="/" className="hover:text-neonCyan">Home</Link>
          <Link to="/notes" className="hover:text-neonCyan">AnonNotes</Link>
          {isLoggedIn && <Link to="/my-notes" className="hover:text-neonCyan">My Notes</Link>}
          {isLoggedIn && <Link to="/profile" className="hover:text-neonCyan">Profile</Link>}
          {role === "admin" && <Link to="/admin" className="text-imposterRed">Admin</Link>}

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn-cyan px-3 py-1">Login</Link>
              <Link to="/signup" className="btn-imposter px-3 py-1">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn-imposter px-3 py-1">
              Logout
            </button>
          )}
        </div>

        {/* Mobile Icon */}
        <div className="sm:hidden text-neonCyan text-xl">
          <Link to="/notes">☰</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
