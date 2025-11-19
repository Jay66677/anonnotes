// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import ApiClient from "../services/ApiClient";

// ES6 class required by assignment
class AuthService {
  constructor() {
    this.user = null;
  }
  setUser(u) { this.user = u; }
  clearUser() { this.user = null; }
  getUser() { return this.user; }
  isLoggedIn() { return !!this.user; }
}

const authService = new AuthService();
const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------
  // On app load → ask backend who is logged in
  // ----------------------------------------
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await ApiClient.get("/auth/me");
        if (res?.user) {
          authService.setUser(res.user);
          setUser(res.user);
        } else {
          authService.clearUser();
          setUser(null);
        }
      } catch {
        authService.clearUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  // ----------------------------------------
  // LOGIN (only needs email + password)
  // Backend creates HTTP-only cookie
  // ----------------------------------------
  async function login(email, password) {
    const res = await ApiClient.post("/auth/login", { email, password });
    
    // Save the returned user object
    authService.setUser(res.user);
    setUser(res.user);

    return res.user;
  }

  // ----------------------------------------
  // SIGNUP — ONLY registers the user
  // DOES NOT login automatically
  // ----------------------------------------
  async function signup(username, email, password) {
    const res = await ApiClient.post("/auth/signup", { username, email, password });
    return res.user;
  }

  // ----------------------------------------
  // LOGOUT — backend clears cookie
  // ----------------------------------------
  async function logout() {
    try {
      await ApiClient.post("/auth/logout");
    } catch (_) {
      // ignore but still clear state
    }
    authService.clearUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        role: user?.role,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
