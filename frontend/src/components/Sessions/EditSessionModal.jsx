/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import sessionApi from "../../api/sessionApi";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "../../styles/classes/edit-session-modal.css";
import { useToast } from "../../hooks/useToast";

dayjs.extend(customParseFormat);
const EditSessionModal = ({
  show,
  handleClose,
  session,
  classroomId,
  onSessionUpdated,
}) => {
  const [updatedSession, setUpdatedSession] = useState({
    title: "",
    session_date: "",
    start_time: "",
    end_time: "",
  });
  const { addToast } = useToast();

  useEffect(() => {
    if (session) {
      setUpdatedSession({
        title: session.title,
        session_date: session.session_date,
        start_time: session.start_time,
        end_time: session.end_time,
      });
    }
  }, [session]);

  const handleInputChange = (e) => {
    setUpdatedSession({ ...updatedSession, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: updatedSession.title.trim(),
      session_date: dayjs(updatedSession.session_date).format("YYYY-MM-DD"),
      start_time: dayjs(updatedSession.start_time, "HH:mm").format("HH:mm"),
      end_time: dayjs(updatedSession.end_time, "HH:mm").format("HH:mm"),
    };

    try {
      const response = await sessionApi.updateSession(
        classroomId,
        session.id,
        payload
      );
      if (response.status === 200) {
        onSessionUpdated(response.data);
        handleClose();
      }
      addToast({
        title: "Thành công!",
        message: "Buổi học đã được cập nhật.",
        type: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật buổi học:", err);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa buổi học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          onSubmit={handleSubmit}
          className="edit-session-modal__form"
        >
          <div className="edit-session-modal__field">
            <label htmlFor="title">Tiêu đề buổi học</label>
            <input
              id="title"
              type="text"
              name="title"
              value={updatedSession.title}
              onChange={handleInputChange}
              required
              className="edit-session-modal__input"
            />
          </div>
          <div className="edit-session-modal__field">
            <label htmlFor="session_date">Ngày học</label>
            <input
              id="session_date"
              type="date"
              name="session_date"
              value={updatedSession.session_date}
              onChange={handleInputChange}
              required
              className="edit-session-modal__input"
            />
          </div>
          <div className="edit-session-modal__field">
            <label htmlFor="start_time">Giờ bắt đầu</label>
            <input
              id="start_time"
              type="time"
              name="start_time"
              value={updatedSession.start_time}
              onChange={handleInputChange}
              required
              className="edit-session-modal__input"
            />
          </div>
          <div className="edit-session-modal__field">
            <label htmlFor="end_time">Giờ kết thúc</label>
            <input
              id="end_time"
              type="time"
              name="end_time"
              value={updatedSession.end_time}
              onChange={handleInputChange}
              required
              className="edit-session-modal__input"
            />
          </div>
          <div className="edit-session-modal__buttons">
            <button
              type="submit"
              className="edit-session-modal__submit-btn"
            >
              Cập nhật buổi học
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="edit-session-modal__cancel-btn"
            >
              Hủy
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditSessionModal;
