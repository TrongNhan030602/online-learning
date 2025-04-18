/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap"; // Sử dụng React Bootstrap
import lessonApi from "../../../api/lessonApi"; // Giả sử API này lấy dữ liệu buổi học
import "../../../styles/student/sessions/session-modal.css";

const SessionModal = ({ showModal, handleClose, classId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };
  useEffect(() => {
    if (classId) {
      const fetchSessions = async () => {
        try {
          const response = await lessonApi.getSessionsByClass(classId);
          setSessions(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu buổi học:", err);
          setError("Không thể lấy dữ liệu buổi học.");
          setLoading(false);
        }
      };
      fetchSessions();
    }
  }, [classId]);

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Danh sách buổi học</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="sessions-list">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="session-card"
                >
                  <h5 className="session-card__title">{session.title}</h5>
                  <p className="session-card__date">
                    Ngày: {new Date(session.session_date).toLocaleDateString()}
                  </p>
                  <p className="session-card__time">
                    Thời gian: {formatTime(session.start_time)} -{" "}
                    {formatTime(session.end_time)}
                  </p>
                </div>
              ))
            ) : (
              <p>Không có buổi học nào trong lớp này.</p>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionModal;
