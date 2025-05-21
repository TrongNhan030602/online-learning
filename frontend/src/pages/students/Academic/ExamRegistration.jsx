import { useState, useEffect } from "react";
import { Table, Badge, Alert } from "react-bootstrap";
import {
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom"; // nếu dùng react-router
import reExamRegistrationApi from "@/api/reExamRegistrationApi";
import "../../../styles/student/academic/exam-registration.css";

const statusVariant = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};
const statusText = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Bị từ chối",
};

const ExamRegistration = () => {
  const [reExamSubjects, setReExamSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    reExamRegistrationApi
      .getMine()
      .then((res) => {
        setReExamSubjects(res.data.data || []);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        // Nếu response có data.message thì dùng thông báo đó, còn không hiện lỗi chung
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setError(error.response.data.message);
        } else {
          setError("Không thể tải dữ liệu đăng ký thi lại.");
        }
        setReExamSubjects([]);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="exam-registration p-3">
      <div className="exam-registration__header mb-4">
        <h2>
          <FontAwesomeIcon
            icon={faCalendarAlt}
            className="me-2"
          />
          Các đăng ký của bạn
        </h2>
        <p className="text-muted">
          Danh sách đăng ký thi lại các môn học của bạn. Vui lòng kiểm tra kỹ
          thông tin lịch thi và trạng thái.
        </p>
      </div>

      {loading && <div className="text-center my-5">Đang tải dữ liệu ...</div>}

      {/* Hiện lỗi API hoặc message server trả về */}
      {error && (
        <Alert
          variant="danger"
          className="text-center"
        >
          {error}
        </Alert>
      )}

      {/* Nếu không lỗi và danh sách rỗng thì hiện cảnh báo và hướng dẫn */}
      {!loading && !error && reExamSubjects.length === 0 && (
        <>
          <Alert
            variant="warning"
            className="text-center"
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="me-2"
            />
            Bạn chưa có đăng ký thi lại nào.
          </Alert>

          <Alert
            variant="info"
            className="text-center"
          >
            Để đăng ký thi lại, bạn vui lòng truy cập{" "}
            <Link
              to="/student/schedule"
              className="exam-registration__link"
            >
              giao diện Lịch thi chính thức
            </Link>{" "}
            và tiến hành đăng ký.
          </Alert>
        </>
      )}

      {/* Hiện bảng nếu có dữ liệu */}
      {!loading && !error && reExamSubjects.length > 0 && (
        <Table
          bordered
          hover
          responsive
          className="shadow-sm"
        >
          <thead>
            <tr className="text-center align-middle">
              <th>#</th>
              <th>Mã môn học</th>
              <th>Tên môn học</th>
              <th>Khóa học</th>
              <th>Ngày thi</th>
              <th>Giờ thi</th>
              <th>Địa điểm</th>
              <th>Lý do đăng ký</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {reExamSubjects.map((item, idx) => {
              const {
                course,
                student_training_program,
                exam_schedule,
                reason,
                status,
              } = item;

              const examDate = exam_schedule.retake_exam_date;
              const startTime = exam_schedule.retake_start_time.slice(0, 5);
              const endTime = exam_schedule.retake_end_time.slice(0, 5);

              return (
                <tr key={item.id}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{course.code}</td>
                  <td>{course.title}</td>
                  <td>{student_training_program.training_program.name}</td>
                  <td className="text-center">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="me-1 text-primary"
                    />
                    {formatDate(examDate)}
                  </td>
                  <td className="text-center">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="me-1 text-primary"
                    />
                    {startTime} - {endTime}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="me-1 text-primary"
                    />
                    {exam_schedule.location}
                  </td>
                  <td>{reason}</td>
                  <td className="text-center">
                    <Badge
                      bg={statusVariant[status] || "secondary"}
                      className="text-uppercase"
                    >
                      {statusText[status] || status}
                    </Badge>
                  </td>
                  <td>{exam_schedule.note || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ExamRegistration;
