// src/providers/UserProvider.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { UserContext } from "../contexts/UserContext";
import userApi from "../api/userApi";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateUser(); // Load dữ liệu khi component mount
  }, []);

  // Hàm cập nhật toàn bộ dữ liệu user (gọi lại API)
  const updateUser = async () => {
    try {
      const response = await userApi.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
