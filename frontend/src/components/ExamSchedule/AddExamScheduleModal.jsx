import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import examScheduleApi from "@/api/examScheduleApi";

const AddExamScheduleModal = ({
  show,
  onClose,
  trainingProgramId,
  semesterId,
  courseId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    course_id: courseId || "",
    training_program_id: trainingProgramId,
    semester_id: semesterId ?? null,
    exam_type: "midterm",
    exam_date: "",
    start_time: "",
    end_time: "",
    duration_minutes: "",
    retake_exam_date: "",
    retake_start_time: "",
    retake_end_time: "",
    location: "",
    note: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (show) {
      setFormData({
        course_id: courseId || "",
        training_program_id: trainingProgramId,
        semester_id: semesterId ?? null,
        exam_type: "midterm",
        exam_date: "",
        start_time: "",
        end_time: "",
        duration_minutes: "",
        retake_exam_date: "",
        retake_start_time: "",
        retake_end_time: "",
        location: "",
        note: "",
      });
    }
  }, [show, courseId, trainingProgramId, semesterId]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    if (
      !formData.course_id ||
      !formData.exam_date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.duration_minutes ||
      !formData.location
    ) {
      setErrorMessage("Vui lòng điền đầy đủ các trường còn thiếu!.");
      return;
    }

    if (Number(formData.duration_minutes) < 15) {
      setErrorMessage("Thời lượng tối thiểu phải là 15 phút.");
      return;
    }

    setLoading(true);
    try {
      await examScheduleApi.createExamSchedule(formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Lỗi khi thêm lịch thi:", err);
      setErrorMessage("Có lỗi xảy ra khi thêm lịch thi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Thêm lịch thi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form>
          <Form.Group controlId="exam_type">
            <Form.Label>Loại kỳ thi</Form.Label>
            <Form.Control
              as="select"
              name="exam_type"
              value={formData.exam_type}
              onChange={handleChange}
            >
              <option value="midterm">Giữa kỳ</option>
              <option value="final">Cuối kỳ</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="exam_date">
            <Form.Label>Ngày thi</Form.Label>
            <Form.Control
              type="date"
              name="exam_date"
              value={formData.exam_date}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group controlId="start_time">
                <Form.Label>Bắt đầu</Form.Label>
                <Form.Control
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="end_time">
                <Form.Label>Kết thúc</Form.Label>
                <Form.Control
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="duration_minutes">
            <Form.Label>Thời lượng (phút)</Form.Label>
            <Form.Control
              type="number"
              min="15"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="retake_exam_date">
            <Form.Label>Ngày thi lại (dự kiến)</Form.Label>
            <Form.Control
              type="date"
              name="retake_exam_date"
              value={formData.retake_exam_date}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group controlId="retake_start_time">
                <Form.Label>Bắt đầu lại</Form.Label>
                <Form.Control
                  type="time"
                  name="retake_start_time"
                  value={formData.retake_start_time}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="retake_end_time">
                <Form.Label>Kết thúc lại</Form.Label>
                <Form.Control
                  type="time"
                  name="retake_end_time"
                  value={formData.retake_end_time}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="location">
            <Form.Label>Địa điểm</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="note">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
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
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang thêm..." : "Thêm lịch thi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddExamScheduleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  trainingProgramId: PropTypes.number.isRequired,
  semesterId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  courseId: PropTypes.number.isRequired, // Cập nhật courseId thay vì course
  onSuccess: PropTypes.func,
};

export default AddExamScheduleModal;
