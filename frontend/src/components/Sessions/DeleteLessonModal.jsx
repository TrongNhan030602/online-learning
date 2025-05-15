/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import sessionApi from "@/api/sessionApi";
import { useToast } from "@/hooks/useToast";

const DeleteLessonModal = ({ show, handleClose, session, onLessonDeleted }) => {
  const { addToast } = useToast();
  const [currentLessons, setCurrentLessons] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load danh sách bài học hiện có cho buổi học
  useEffect(() => {
    if (show && session?.id) {
      setLoading(true);
      sessionApi
        .getCurrentLessons(session.id)
        .then((res) => {
          setCurrentLessons(res.data);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy bài học hiện có:", err);
          addToast({
            title: "Lỗi!",
            message: "Không thể tải danh sách bài học hiện có.",
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
      // Xóa các bài học đã chọn
      await Promise.all(
        selectedLessons.map((lessonId) =>
          sessionApi.removeLessonFromSession(session.id, lessonId)
        )
      );

      addToast({
        title: "Thành công!",
        message: "Đã xóa bài học khỏi buổi học.",
        type: "success",
      });

      onLessonDeleted?.(selectedLessons); // Gọi callback sau khi xóa
      handleClose();
      setSelectedLessons([]);
    } catch (err) {
      console.error("Lỗi khi xóa bài học:", err);
      addToast({
        title: "Lỗi!",
        message: "Có lỗi xảy ra khi xóa bài học.",
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
      dialogClassName="delete-lesson-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faBook} /> Xóa bài học khỏi buổi:{" "}
          <strong>{session?.title}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="delete-lesson-modal__loading">
            <Spinner animation="border" /> Đang tải bài học...
          </div>
        ) : (
          <Form>
            {currentLessons.map((lesson) => (
              <Form.Check
                key={lesson.id}
                type="checkbox"
                id={`lesson-${lesson.id}`}
                label={lesson.title}
                checked={selectedLessons.includes(lesson.id)}
                onChange={() => handleLessonToggle(lesson.id)}
                className="delete-lesson-modal__item"
              />
            ))}
            {currentLessons.length === 0 && (
              <p className="delete-lesson-modal__empty">
                Không có bài học nào để xóa.
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
          variant="danger"
          onClick={handleSubmit}
          disabled={submitting || selectedLessons.length === 0}
        >
          {submitting ? (
            "Đang xóa..."
          ) : (
            <>
              <FontAwesomeIcon icon={faTrashAlt} /> Xóa bài học
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteLessonModal;
