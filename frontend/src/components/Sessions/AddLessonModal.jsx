/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import sessionApi from "../../api/sessionApi";
import { useToast } from "../../hooks/useToast";

const AddLessonModal = ({ show, handleClose, session, onLessonAdded }) => {
  const { addToast } = useToast();
  const [availableLessons, setAvailableLessons] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load danh sách bài học có thể thêm
  useEffect(() => {
    if (show && session?.id) {
      setLoading(true);
      sessionApi
        .getAvailableLessons(session.id)
        .then((res) => {
          setAvailableLessons(res.data);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy bài học có sẵn:", err);
          addToast({
            title: "Lỗi!",
            message: "Không thể tải danh sách bài học có sẵn.",
            type: "error",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [show, session?.id, addToast]);

  const handleLessonToggle = (lessonId) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleSubmit = async () => {
    if (selectedLessons.length === 0) return;

    setSubmitting(true);
    try {
      await sessionApi.addLessonsToSession(session.id, selectedLessons);

      addToast({
        title: "Thành công!",
        message: "Đã thêm bài học vào buổi học.",
        type: "success",
      });

      onLessonAdded();
      handleClose();
      setSelectedLessons([]);
    } catch (err) {
      console.error("Lỗi khi thêm bài học:", err);
      addToast({
        title: "Lỗi!",
        message: "Có lỗi xảy ra khi thêm bài học.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="add-lesson-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faBook} /> Thêm bài học vào buổi:{" "}
          <strong>{session?.title}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="add-lesson-modal__loading">
            <Spinner animation="border" /> Đang tải bài học...
          </div>
        ) : (
          <Form>
            {availableLessons.map((lesson) => (
              <Form.Check
                key={lesson.id}
                type="checkbox"
                id={`lesson-${lesson.id}`}
                label={lesson.title}
                checked={selectedLessons.includes(lesson.id)}
                onChange={() => handleLessonToggle(lesson.id)}
                className="add-lesson-modal__item"
              />
            ))}
            {availableLessons.length === 0 && (
              <p className="add-lesson-modal__empty">
                Tất cả bài học đã được thêm vào buổi học.
              </p>
            )}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Hủy
        </Button>
        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={submitting || selectedLessons.length === 0}
        >
          {submitting ? (
            "Đang thêm..."
          ) : (
            <>
              <FontAwesomeIcon icon={faCheckCircle} /> Thêm bài học
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddLessonModal;
