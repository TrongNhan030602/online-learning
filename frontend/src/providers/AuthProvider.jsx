import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "@/contexts/AuthContext";
import authApi from "@/api/authApi";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authApi.getUser();
      setUser(response.data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("token", response.data.access_token);
      setUser({ role: response.data.role });
      return response;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    await authApi.register({ name, email, password });
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
