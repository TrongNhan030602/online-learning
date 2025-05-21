/* eslint-disable react/prop-types */
import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import reExamRegistrationApi from "@/api/reExamRegistrationApi";

const RetakeExamModal = ({ show, onHide, exam, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [status] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setReason("");
      setError(null);
      setLoading(false);
    }
  }, [show, exam]);

  if (!exam) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await reExamRegistrationApi.create({
        student_training_program_id: exam.student_training_program_id,
        course_id: exam.course.course_id,
        exam_schedule_id: exam.exam_id,
        registration_date: new Date().toISOString().split("T")[0],
        reason: reason.trim(),
        status,
      });
      onHide();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      const backendError =
        err?.response?.data?.error || "Đăng ký thất bại, thử lại sau";
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Đăng ký thi lại - {exam.course.course_title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Ngày thi lại dự kiến:</strong>{" "}
          {new Date(
            exam.retake_exam_details.retake_exam_date
          ).toLocaleDateString("vi-VN")}
        </p>
        <Form>
          <Form.Group
            className="mb-3"
            controlId="reason"
          >
            <Form.Label>Lý do đăng ký</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do đăng ký thi lại"
              required
            />
          </Form.Group>
          {error && <p className="text-danger">{error}</p>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          disabled={loading}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !reason.trim()}
        >
          {loading ? "Đang gửi..." : "Đăng ký"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RetakeExamModal;
