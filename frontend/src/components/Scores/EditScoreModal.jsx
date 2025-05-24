/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditScoreModal = ({ show, onClose, score, onSave }) => {
  const [formData, setFormData] = useState({
    user_id: null,
    student_training_program_id: null,
    course_id: null,
    semester_id: null,
    value: "",
    score_type: "final",
    // attempt ẩn, không cần lưu vào state UI
    is_accepted: false,
  });

  useEffect(() => {
    if (score) {
      setFormData({
        user_id: score.user?.id ?? null,
        student_training_program_id: score.student_training_program_id ?? null,
        course_id: score.course?.id ?? null,
        semester_id: score.semester?.id ?? null,
        value: score.value ?? "",
        score_type: score.score_type ?? "final",
        is_accepted: score.is_accepted ?? false,
      });
    }
  }, [score]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: score?.id,
      ...formData,
      user_id: formData.user_id ? Number(formData.user_id) : null,
      student_training_program_id: formData.student_training_program_id
        ? Number(formData.student_training_program_id)
        : null,
      course_id: formData.course_id ? Number(formData.course_id) : null,
      semester_id: formData.semester_id ? Number(formData.semester_id) : null,
      value: Number(formData.value),
      attempt: 1,
      is_accepted: formData.is_accepted,
    };

    onSave(payload);
  };

  const scoreTypeLabels = {
    final: "Cuối kỳ",
    midterm: "Giữa kỳ",
    quiz: "Kiểm tra",
    assignment: "Bài tập",
  };

  const getScoreTypeLabel = (type) => scoreTypeLabels[type] || type;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa điểm</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Điểm</Form.Label>
            <Form.Control
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              min={0}
              max={10}
              step={0.1}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              readOnly
              value={getScoreTypeLabel(formData.score_type)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Check
              type="checkbox"
              label="Đã duyệt"
              name="is_accepted"
              checked={formData.is_accepted}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            type="submit"
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditScoreModal;
