import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, Alert } from "react-bootstrap";
import examScheduleApi from "@/api/examScheduleApi";
import { useToast } from "@/hooks/useToast";

const ExamScheduleModal = ({
  show,
  onClose,
  scheduleData,
  onSave,
  course_id,
}) => {
  const [formData, setFormData] = useState({
    course_id: course_id || "",
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
  const { addToast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scheduleData) {
      setFormData({
        ...scheduleData,
        exam_date: scheduleData.exam_date?.split("T")[0] || "",
        retake_exam_date: scheduleData.retake_exam_date?.split("T")[0] || "",
      });
    }
  }, [scheduleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatTime = (timeString) => {
    return timeString?.slice(0, 5); // chỉ lấy HH:mm
  };

  const handleSubmit = async () => {
    if (
      !formData.course_id ||
      !formData.exam_date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.duration_minutes ||
      !formData.location
    ) {
      setErrorMessage("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        course_id: formData.course_id,
        exam_type: formData.exam_type,
        exam_date: formData.exam_date,
        start_time: formatTime(formData.start_time),
        end_time: formatTime(formData.end_time),
        duration_minutes: formData.duration_minutes,
        retake_exam_date: formData.retake_exam_date,
        retake_start_time: formatTime(formData.retake_start_time),
        retake_end_time: formatTime(formData.retake_end_time),
        location: formData.location,
        note: formData.note,
      };

      await examScheduleApi.updateExamSchedule(
        scheduleData.exam_id,
        dataToSend
      );
      onSave({
        ...scheduleData,
        ...dataToSend,
      });
      addToast({
        title: "Thành công!",
        message: "Lịch thi đã được cập nhật",
        type: "success",
        duration: 1500,
      });
    } catch (error) {
      console.error("Lỗi khi lưu lịch thi:", error);
      setErrorMessage(
        error?.response?.data?.message || "Có lỗi xảy ra khi lưu lịch thi."
      );
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
        <Modal.Title>Chỉnh sửa lịch thi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <Alert
            variant="danger"
            onClose={() => setErrorMessage("")}
            dismissible
          >
            {errorMessage}
          </Alert>
        )}
        <Form>
          <Form.Group controlId="exam_type">
            <Form.Label>Loại kỳ thi</Form.Label>
            <Form.Control
              as="select"
              name="exam_type"
              value={formData.exam_type || "midterm"}
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
              value={formData.exam_date || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group controlId="start_time">
                <Form.Label>Giờ thi bắt đầu</Form.Label>
                <Form.Control
                  type="time"
                  name="start_time"
                  value={formData.start_time || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="end_time">
                <Form.Label>Giờ thi kết thúc</Form.Label>
                <Form.Control
                  type="time"
                  name="end_time"
                  value={formData.end_time || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="duration_minutes">
            <Form.Label>Thời gian thi (phút)</Form.Label>
            <Form.Control
              type="number"
              min="15"
              name="duration_minutes"
              value={formData.duration_minutes || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="retake_exam_date">
            <Form.Label>Ngày thi lại (dự kiến)</Form.Label>
            <Form.Control
              type="date"
              name="retake_exam_date"
              value={formData.retake_exam_date || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group controlId="retake_start_time">
                <Form.Label>Giờ thi lại bắt đầu</Form.Label>
                <Form.Control
                  type="time"
                  name="retake_start_time"
                  value={formData.retake_start_time || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="retake_end_time">
                <Form.Label>Giờ thi lại kết thúc</Form.Label>
                <Form.Control
                  type="time"
                  name="retake_end_time"
                  value={formData.retake_end_time || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="location">
            <Form.Label>Địa điểm thi</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="note">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              name="note"
              value={formData.note || ""}
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
          Đóng
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Cập nhật"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ExamScheduleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  scheduleData: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  course_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default ExamScheduleModal;
