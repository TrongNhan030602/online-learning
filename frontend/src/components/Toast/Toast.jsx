import { useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faInfoCircle,
  faCircleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/toast.css";

const Toast = ({ id, title, message, type, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration + 1000); // Thời gian hiển thị + thời gian fadeOut
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClick = (e) => {
    if (e.target.closest(".toast__close")) {
      onClose(id);
    }
  };

  const icons = {
    success: faCircleCheck,
    info: faInfoCircle,
    warning: faCircleExclamation,
    error: faCircleExclamation,
  };

  const icon = icons[type];
  const delay = (duration / 1000).toFixed(2);

  return createPortal(
    <div
      className={`toast toast--${type}`}
      style={{
        animation: `slideInLeft 0.3s ease, fadeOut 1s linear ${delay}s forwards`,
      }}
      onClick={handleClick}
    >
      <div className="toast__icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="toast__body">
        {title && <h3 className="toast__title">{title}</h3>}
        <p className="toast__msg">{message}</p>
      </div>
      <div className="toast__close">
        <FontAwesomeIcon icon={faXmark} />
      </div>
    </div>,
    document.getElementById("toast")
  );
};

Toast.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(["success", "info", "warning", "error"]),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

Toast.defaultProps = {
  title: "",
  message: "",
  type: "info",
  duration: 1000,
};

export default Toast;
