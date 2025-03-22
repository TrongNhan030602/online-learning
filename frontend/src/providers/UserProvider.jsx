// src/providers/UserProvider.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { UserContext } from "../contexts/UserContext";
import userApi from "../api/userApi";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");

    if (token) {
      updateUser(isMounted);
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false; // Cleanup tránh cập nhật state khi unmount
    };
  }, []);

  // Hàm cập nhật toàn bộ dữ liệu user (gọi lại API)
  const updateUser = async (isMounted = true) => {
    try {
      const response = await userApi.getProfile();
      if (isMounted) setUser(response.data);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      if (isMounted) setUser(null);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, loading }}>
      {loading ? null : children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
