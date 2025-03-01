import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import authApi from "../api/authApi";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Kiểm tra token trước khi gọi API
      if (!localStorage.getItem("token")) {
        setLoading(false);
        return;
      }
      try {
        const response = await authApi.getUser();
        setUser(response.data);
      } catch (error) {
        console.log("Not logged in", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem("token", response.data.access_token);
    try {
      const userResponse = await authApi.getUser();
      setUser(userResponse.data);
    } catch (error) {
      console.error("Failed to fetch user after login:", error);
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
