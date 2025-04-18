/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import lessonApi from "../../api/lessonApi"; // Đảm bảo bạn đang import đúng
import sessionApi from "../../api/sessionApi";
import { useToast } from "../../hooks/useToast";

import "../../styles/classes/add-lesson-modal.css";

const AddLessonModal = ({
  show,
  handleClose,
  classroomId,
  session,
  courseId,
  onLessonAdded,
}) => {
  const { addToast } = useToast();
  const [lessons, setLessons] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Lấy danh sách bài học từ API khi modal mở
  useEffect(() => {
    if (show && courseId) {
      // Kiểm tra xem show là true và courseId có được truyền không
      setLoading(true);
      lessonApi
        .getLessons(courseId) // Truyền courseId vào API
        .then((res) => {
          setLessons(res.data);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy bài học:", err);
          addToast({
            title: "Lỗi!",
            message: "Không thể tải danh sách bài học.",
            type: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [show, courseId, addToast]); // Thêm courseId vào dependency array

  // Chuyển đổi trạng thái chọn bài học
  const handleLessonToggle = (lessonId) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  // Xử lý khi nhấn nút thêm bài học
  const handleSubmit = async () => {
    if (selectedLessons.length === 0) return; // Kiểm tra xem có chọn bài học nào không

    setSubmitting(true);
    try {
      await sessionApi.addLessonToSession(classroomId, session.id, {
        lesson_ids: selectedLessons, // Gửi các ID bài học đã chọn
      });

      addToast({
        title: "Thành công!",
        message: "Đã thêm bài học vào buổi học.",
        type: "success",
      });

      onLessonAdded?.(); // Call callback khi thêm thành công
      handleClose(); // Đóng modal
      setSelectedLessons([]); // Reset danh sách bài học đã chọn
    } catch (err) {
      console.error("Lỗi khi thêm bài học:", err);
      addToast({
        title: "Lỗi!",
        message: "Có lỗi khi thêm bài học.",
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
            {lessons.map((lesson) => (
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
            {lessons.length === 0 && (
              <p className="add-lesson-modal__empty">Không có bài học nào.</p>
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
