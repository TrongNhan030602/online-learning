import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/confirm-dialog.css";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 300); // Đợi animation ẩn hoàn tất
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className={`confirm-dialog ${isOpen ? "show" : "hide"}`}>
      <div
        className="confirm-dialog__overlay"
        onClick={onCancel}
      ></div>
      <div className="confirm-dialog__box">
        <h3 className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button
            className="confirm-dialog__btn confirm-dialog__btn--cancel"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            className="confirm-dialog__btn confirm-dialog__btn--confirm"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDialog;
