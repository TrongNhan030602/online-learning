import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";
import lessonApi from "../../api/lessonApi";
import { useToast } from "../../hooks/useToast";

const LessonModal = ({
  show,
  handleClose,
  sessionId,
  lessonToEdit = null,
  onLessonUpdated,
}) => {
  const [lessonData, setLessonData] = useState({
    title: "",
    content: "",
  });
  const { addToast } = useToast();

  useEffect(() => {
    if (lessonToEdit) {
      setLessonData({
        title: lessonToEdit.title || "",
        content: lessonToEdit.content || "",
      });
    } else {
      setLessonData({ title: "", content: "" });
    }
  }, [lessonToEdit, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      course_session_id: sessionId,
      title: lessonData.title,
      content: lessonData.content,
    };

    try {
      if (lessonToEdit) {
        await lessonApi.updateLesson(lessonToEdit.id, payload);
      } else {
        await lessonApi.createLesson(payload);
      }

      handleClose();
      onLessonUpdated?.();
      addToast({
        title: "Thành công!",
        message: lessonToEdit
          ? "Bài học đã được cập nhật"
          : "Bài học đã được thêm",
        type: "success",
        duration: 1500,
      });
    } catch (err) {
      console.error(err);
      alert(
        lessonToEdit ? "Cập nhật bài học thất bại" : "Thêm bài học thất bại"
      );
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {lessonToEdit ? "Chỉnh sửa Bài Học" : "Thêm Bài Học Mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Form.Group controlId="formLessonTitle">
            <Form.Label>Tiêu đề bài học</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tiêu đề"
              name="title"
              value={lessonData.title}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group
            controlId="formLessonContent"
            className="mt-3"
          >
            <Form.Label>Nội dung</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Nhập nội dung bài học"
              name="content"
              value={lessonData.content}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Đóng
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
        >
          {lessonToEdit ? "Lưu thay đổi" : "Thêm Bài Học"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// ✅ PropTypes khai báo chuẩn ESLint
LessonModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  sessionId: PropTypes.number.isRequired,
  lessonToEdit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  onLessonUpdated: PropTypes.func,
};

export default LessonModal;
