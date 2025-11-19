// client/src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      await login(email, password);  // FIXED

      navigate("/");
    } catch (error) {
      setErr(error.message || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="card-dark w-full max-w-md shadow-neonCyan p-6 flex flex-col gap-5 fade-in"
      >
        <h2 className="text-2xl font-bold text-center text-neonCyan">
          ACCESS ANONYMOUSLY
        </h2>

        {err && <p className="text-alert text-center">{err}</p>}

        <input
          type="email"
          placeholder="Email"
          className="input-dark"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input-dark"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-imposter">
          LOGIN
        </button>

        <p className="text-center text-sm">
          New?{" "}
          <Link to="/signup" className="text-neonCyan hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;