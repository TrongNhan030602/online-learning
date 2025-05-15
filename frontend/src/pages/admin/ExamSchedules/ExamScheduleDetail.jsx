import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCalendarAlt,
  faClock,
  faRedo,
  faMapMarkerAlt,
  faStickyNote,
  faGraduationCap,
  faLayerGroup,
  faArrowLeft,
  faHourglassStart,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/common/Loading";
import examScheduleApi from "@/api/examScheduleApi";
import "../../../styles/exam-schedules/exam-schedule-detail.css";

const ExamScheduleDetail = () => {
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await examScheduleApi.getExamScheduleById(id);
        setSchedule(res.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết lịch thi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Format ngày 'YYYY-MM-DD' thành 'DD/MM/YYYY'
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // lưu ý: tháng từ 0-11 nên +1
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format giờ 'HH:mm:ss' thành 'HH:mm' (bỏ giây)
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    // cắt chuỗi lấy 5 ký tự đầu (HH:mm)
    return timeStr.substring(0, 5);
  };

  if (loading) {
    return (
      <Loading
        text="Đang tải lịch thi..."
        className="my-5"
      />
    );
  }

  if (!schedule) {
    return (
      <p className="text-danger text-center my-5">Không tìm thấy lịch thi.</p>
    );
  }

  return (
    <Container className="exam-schedule-detail py-4">
      <Link
        to="/admin/exam-schedules"
        className="btn btn-outline-secondary mb-4 exam-schedule-detail__back-btn"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
      </Link>

      <h2 className="exam-schedule-detail__title">
        Chi tiết lịch thi #{schedule.id}
      </h2>

      {/* Thông tin học phần */}
      <Card className="exam-schedule-detail__card mb-4 shadow-sm">
        <Card.Header className="exam-schedule-detail__section-title bg-light">
          Thông tin học phần
        </Card.Header>
        <Card.Body>
          <Row>
            <Col
              md={6}
              className="exam-schedule-detail__item"
            >
              <FontAwesomeIcon
                icon={faBook}
                className="exam-schedule-detail__icon text-primary"
              />
              <span className="exam-schedule-detail__label">Môn học:</span>
              <span className="exam-schedule-detail__value">
                {schedule.course.title} ({schedule.course.code})
              </span>
            </Col>

            <Col
              md={6}
              className="exam-schedule-detail__item"
            >
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="exam-schedule-detail__icon text-success"
              />
              <span className="exam-schedule-detail__label">Chương trình:</span>
              <span className="exam-schedule-detail__value">
                {schedule.training_program.name} (
                {schedule.training_program.code})
              </span>
            </Col>

            <Col
              md={6}
              className="exam-schedule-detail__item"
            >
              <FontAwesomeIcon
                icon={faLayerGroup}
                className="exam-schedule-detail__icon text-warning"
              />
              <span className="exam-schedule-detail__label">Học kỳ:</span>
              <span className="exam-schedule-detail__value">
                {schedule.semester?.name || "Không có"}
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Thời gian thi */}
      <Card className="exam-schedule-detail__card mb-4 shadow-sm">
        <Card.Header className="exam-schedule-detail__section-title bg-light">
          Thời gian thi
        </Card.Header>
        <Card.Body>
          <Row>
            <Col
              md={6}
              className="exam-schedule-detail__item"
            >
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="exam-schedule-detail__icon text-danger"
              />
              <span className="exam-schedule-detail__label">Ngày thi:</span>
              <span className="exam-schedule-detail__value">
                {formatDate(schedule.exam_date)}
              </span>
            </Col>

            <Col
              md={6}
              className="exam-schedule-detail__item"
            >
              <FontAwesomeIcon
                icon={faClock}
                className="exam-schedule-detail__icon text-info"
              />
              <span className="exam-schedule-detail__label">Thời gian:</span>
              <span className="exam-schedule-detail__value">
                {formatTime(schedule.start_time)} -{" "}
                {formatTime(schedule.end_time)}
              </span>
            </Col>

            <Col
              md={6}
              className="exam-schedule-detail__item"
            >
              <FontAwesomeIcon
                icon={faHourglassStart}
                className="exam-schedule-detail__icon text-info"
              />
              <span className="exam-schedule-detail__label">Thời lượng:</span>
              <span className="exam-schedule-detail__value">
                {schedule.duration_minutes} phút
              </span>
            </Col>

            <Col
              md={6}
              className="exam-schedule-detail__item"
            >
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="exam-schedule-detail__icon text-secondary"
              />
              <span className="exam-schedule-detail__label">Địa điểm:</span>
              <span className="exam-schedule-detail__value">
                {schedule.location}
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Thi lại */}
      <Card className="exam-schedule-detail__card mb-4 shadow-sm">
        <Card.Header className="exam-schedule-detail__section-title bg-light">
          Thông tin thi lại
        </Card.Header>
        <Card.Body>
          <Row>
            <Col
              md={6}
              className="exam-schedule-detail__item"
            >
              <FontAwesomeIcon
                icon={faRedo}
                className="exam-schedule-detail__icon text-primary"
              />
              <span className="exam-schedule-detail__label">Ngày thi lại:</span>
              <span className="exam-schedule-detail__value">
                {formatDate(schedule.retake_exam_date)}
              </span>
            </Col>

            <Col
              md={6}
              className="exam-schedule-detail__item"
            >
              <FontAwesomeIcon
                icon={faClock}
                className="exam-schedule-detail__icon text-info"
              />
              <span className="exam-schedule-detail__label">
                Thời gian thi lại:
              </span>
              <span className="exam-schedule-detail__value">
                {formatTime(schedule.retake_start_time)} -{" "}
                {formatTime(schedule.retake_end_time)}
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Ghi chú */}
      <Card className="exam-schedule-detail__card shadow-sm">
        <Card.Header className="exam-schedule-detail__section-title bg-light">
          Ghi chú
        </Card.Header>
        <Card.Body>
          <div className="exam-schedule-detail__item">
            <FontAwesomeIcon
              icon={faStickyNote}
              className="exam-schedule-detail__icon text-muted"
            />
            <span className="exam-schedule-detail__value text-muted fst-italic">
              {schedule.note || "Không có ghi chú"}
            </span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExamScheduleDetail;
