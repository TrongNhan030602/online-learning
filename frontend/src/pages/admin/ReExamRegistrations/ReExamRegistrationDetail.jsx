/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBook,
  faCalendarAlt,
  faInfoCircle,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import reExamRegistrationApi from "@/api/reExamRegistrationApi";
import "../../../styles/re-exam-schedules/re-exam-registration-detail.css";

const statusColorMap = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
};

const statusTextMap = {
  approved: "Đã duyệt",
  pending: "Chờ duyệt",
  rejected: "Từ chối",
};

const examTypeMap = {
  midterm: "Giữa kỳ",
  final: "Cuối kỳ",
};

function formatDateVN(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")} / ${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")} / ${d.getFullYear()}`;
}

function formatDateTimeVN(dateTimeStr) {
  if (!dateTimeStr) return "-";
  const d = new Date(dateTimeStr);
  return d.toLocaleString("vi-VN", { hour12: false });
}
function formatTime(timeStr) {
  if (!timeStr) return "-";
  const [hour, minute] = timeStr.split(":");
  return `${hour}:${minute}`;
}
const statusOptions = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

function UpdateStatusModal({ show, onHide, currentStatus, onSave, saving }) {
  const [newStatus, setNewStatus] = useState(currentStatus);

  // Sync when currentStatus changes (e.g. reopening modal)
  useEffect(() => {
    setNewStatus(currentStatus);
  }, [currentStatus]);

  const handleSave = () => {
    onSave(newStatus);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật trạng thái đăng ký</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {statusOptions.map(({ value, label }) => (
            <Form.Check
              key={value}
              type="radio"
              name="status"
              id={`status-${value}`}
              label={label}
              value={value}
              checked={newStatus === value}
              onChange={() => setNewStatus(value)}
              disabled={saving}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          disabled={saving}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                className="me-2"
              />{" "}
              Đang lưu
            </>
          ) : (
            "Lưu"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const ReExamRegistrationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await reExamRegistrationApi.getById(id);
        setRegistration(res.data.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Không thể tải chi tiết đăng ký thi lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleStatusSave = async (newStatus) => {
    if (!registration) return;
    setSavingStatus(true);
    try {
      await reExamRegistrationApi.changeStatus(registration.id, newStatus);

      // Cập nhật local state
      setRegistration((prev) => ({ ...prev, status: newStatus }));
      setShowStatusModal(false);
    } catch (err) {
      alert("Cập nhật trạng thái thất bại, thử lại sau.");
      console.error(err);
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading)
    return (
      <Container className="reexamd__loading text-center mt-5">
        <Spinner
          animation="border"
          role="status"
        />
        <p>Đang tải dữ liệu...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="reexamd__error mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!registration)
    return (
      <Container className="reexamd__empty mt-5">
        <Alert variant="warning">Không tìm thấy đăng ký thi lại.</Alert>
      </Container>
    );

  const { student, course, exam_schedule, reason, status, created_at } =
    registration;

  return (
    <Container className="reexamd mt-4 mb-5">
      <Button
        variant="outline-primary"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="me-2"
        />
        Quay lại
      </Button>

      <h2 className="reexamd__title mb-4">
        Chi tiết đăng ký thi lại <span className="text-primary">#{id}</span>
      </h2>

      {/* Info Sections */}
      <Row className="mb-4 gx-4">
        <Col md={6}>
          <Card className="reexamd__card shadow-sm">
            <Card.Header className="reexamd__card-header">
              <FontAwesomeIcon
                icon={faUser}
                className="me-2"
              />
              Thông tin học viên
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Tên:</strong> {student?.name || "-"}
              </p>
              <p>
                <strong>Email:</strong> {student?.email || "-"}
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="reexamd__card shadow-sm">
            <Card.Header className="reexamd__card-header">
              <FontAwesomeIcon
                icon={faBook}
                className="me-2"
              />
              Môn học &amp; Chương trình
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Mã môn học:</strong> {course?.code || "-"}
              </p>
              <p>
                <strong>Tên môn học:</strong> {course?.title || "-"}
              </p>
              <p>
                <strong>Chương trình đào tạo:</strong>{" "}
                {registration.student_training_program?.training_program
                  ?.name || "-"}{" "}
                (
                {registration.student_training_program?.training_program
                  ?.code || ""}
                )
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Exam Schedule */}
      <Card className="reexamd__card shadow-sm mb-4">
        <Card.Header className="reexamd__card-header">
          <FontAwesomeIcon
            icon={faCalendarAlt}
            className="me-2"
          />
          Lịch thi
        </Card.Header>
        <Card.Body>
          <Row className="gx-4">
            <Col
              md={4}
              className="mb-3 mb-md-0"
            >
              <p>
                <strong>Ngày thi chính thức:</strong>{" "}
                {formatDateVN(exam_schedule?.exam_date)}
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {formatTime(exam_schedule?.start_time) || "-"} -{" "}
                {formatTime(exam_schedule?.end_time) || "-"}
              </p>
              <p>
                <strong>Địa điểm:</strong> {exam_schedule?.location || "-"}
              </p>
            </Col>
            <Col
              md={4}
              className="mb-3 mb-md-0"
            >
              <p>
                <strong className="text-danger">Ngày thi lại:</strong>{" "}
                {formatDateVN(exam_schedule?.retake_exam_date)}
              </p>
              <p>
                <strong className="text-danger">Thời gian thi lại:</strong>{" "}
                {formatTime(exam_schedule?.retake_start_time)} -{" "}
                {formatTime(exam_schedule?.retake_end_time)}
              </p>

              <p>
                <strong className="text-danger">Ghi chú:</strong>{" "}
                {exam_schedule?.note || "-"}
              </p>
            </Col>
            <Col md={4}>
              <p>
                <strong>Học kỳ:</strong> {exam_schedule?.semester?.name || "-"}
              </p>
              <p>
                <strong>Loại thi:</strong>{" "}
                {examTypeMap[exam_schedule?.exam_type] ||
                  exam_schedule?.exam_type ||
                  "-"}
              </p>
              <p>
                <strong>Thời lượng:</strong>{" "}
                {exam_schedule?.duration_minutes || "-"} phút
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Registration Info */}
      <Card className="reexamd__card shadow-sm">
        <Card.Header className="reexamd__card-header d-flex justify-content-between align-items-center">
          <div>
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="me-2"
            />
            Thông tin đăng ký
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p>
                <strong>Lý do thi lại:</strong> {reason || "Không có"}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <Badge
                  bg={statusColorMap[status] || "secondary"}
                  className="reexamd__badge-status"
                >
                  {statusTextMap[status] || status}{" "}
                  <FontAwesomeIcon
                    icon={status === "approved" ? faCheckCircle : faTimesCircle}
                  />
                </Badge>
              </p>
              <p>
                <strong>Ngày đăng ký:</strong> {formatDateTimeVN(created_at)}
              </p>
            </div>
            <div>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => setShowStatusModal(true)}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className="me-1"
                />
                Cập nhật trạng thái
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Modal cập nhật trạng thái */}
      <UpdateStatusModal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        currentStatus={status}
        onSave={handleStatusSave}
        saving={savingStatus}
      />
    </Container>
  );
};

export default ReExamRegistrationDetail;
