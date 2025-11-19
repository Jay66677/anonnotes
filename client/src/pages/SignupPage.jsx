// client/src/pages/SignupPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();  // use signup ONLY

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (password.length < 6) {
      return setErr("Password must be at least 6 characters");
    }

    try {
      // Register user → DOES NOT login automatically
      await signup(username, email, password);

      alert("Account created successfully! Please log in.");
      navigate("/login"); // redirect to login

    } catch (error) {
      setErr(error.message || "Signup failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="card-dark w-full max-w-md shadow-neonCyan p-6 flex flex-col gap-5 fade-in"
      >
        <h2 className="text-2xl font-bold text-center text-neonCyan">
          JOIN THE ANONYMOUS
        </h2>

        {err && <p className="text-alert text-center">{err}</p>}

        <input
          type="text"
          placeholder="Username"
          className="input-dark"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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
          SIGN UP
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-neonCyan hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;