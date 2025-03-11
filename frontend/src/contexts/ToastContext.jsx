// src/contexts/ToastContext.jsx
import { createContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import Toast from "../components/Toast/Toast";

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type, duration }) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Render toast vào container có id="toast" */}
      <div id="toast">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
