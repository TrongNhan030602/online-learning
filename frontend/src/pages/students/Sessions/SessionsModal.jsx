import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import lessonApi from "../../../api/lessonApi";
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
        <Modal.Title className="sessions__modal-title">
          Danh sách buổi học
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="sessions__loading">Đang tải...</div>
        ) : error ? (
          <div className="sessions__error">{error}</div>
        ) : (
          <div className="sessions__list">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="sessions__card"
                >
                  <h5 className="sessions__card-title">{session.title}</h5>
                  <p className="sessions__card-date">
                    Ngày:{" "}
                    {new Date(session.session_date).toLocaleDateString("en-GB")}
                  </p>
                  <p className="sessions__card-time">
                    Thời gian: {formatTime(session.start_time)} -{" "}
                    {formatTime(session.end_time)}
                  </p>
                </div>
              ))
            ) : (
              <p className="sessions__empty-message">
                Không có buổi học nào trong lớp này.
              </p>
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
SessionModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  classId: PropTypes.string.isRequired,
};

export default SessionModal;
