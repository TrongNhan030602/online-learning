/* eslint-disable react/prop-types */
// src/components/Sessions/AddSessionModal.jsx
import { useState } from "react";
import { Modal } from "react-bootstrap";
import sessionApi from "../../api/sessionApi";
import "../../styles/classes/add-session-modal.css";
const AddSessionModal = ({ show, handleClose, classId, onSessionAdded }) => {
  const [newSession, setNewSession] = useState({
    title: "",
    session_date: "",
    start_time: "",
    end_time: "",
  });

  const handleInputChange = (e) => {
    setNewSession({ ...newSession, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sessionApi.createSession(classId, newSession);
      if (response.status === 201) {
        onSessionAdded(response.data); // Cập nhật lại danh sách buổi học
        handleClose(); // Đóng modal
        setNewSession({
          title: "",
          session_date: "",
          start_time: "",
          end_time: "",
        }); // Reset form
      }
    } catch (err) {
      console.error("Lỗi khi thêm buổi học:", err);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Thêm buổi học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          onSubmit={handleSubmit}
          className="add-session-modal__form"
        >
          <div className="add-session-modal__field">
            <label htmlFor="title">Tiêu đề buổi học</label>
            <input
              id="title"
              type="text"
              name="title"
              value={newSession.title}
              onChange={handleInputChange}
              required
              className="add-session-modal__input"
            />
          </div>
          <div className="add-session-modal__field">
            <label htmlFor="session_date">Ngày học</label>
            <input
              id="session_date"
              type="date"
              name="session_date"
              value={newSession.session_date}
              onChange={handleInputChange}
              required
              className="add-session-modal__input"
            />
          </div>
          <div className="add-session-modal__field">
            <label htmlFor="start_time">Giờ bắt đầu</label>
            <input
              id="start_time"
              type="time"
              name="start_time"
              value={newSession.start_time}
              onChange={handleInputChange}
              required
              className="add-session-modal__input"
            />
          </div>
          <div className="add-session-modal__field">
            <label htmlFor="end_time">Giờ kết thúc</label>
            <input
              id="end_time"
              type="time"
              name="end_time"
              value={newSession.end_time}
              onChange={handleInputChange}
              required
              className="add-session-modal__input"
            />
          </div>
          <div className="add-session-modal__buttons">
            <button
              type="submit"
              className="add-session-modal__submit-btn"
            >
              Thêm buổi học
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="add-session-modal__cancel-btn"
            >
              Hủy
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddSessionModal;
