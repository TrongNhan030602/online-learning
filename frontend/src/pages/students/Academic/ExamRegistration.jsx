// src/pages/students/Academic/ExamRegistration.jsx
import { useState } from "react";
import { Table, Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faTimesCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../../../styles/student/academic/exam-registration.css";

const ExamRegistration = () => {
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [semester, setSemester] = useState("Học kỳ 2");

  // Dữ liệu giả - để hiển thị 'Không có'
  const reExamSubjects = [];

  return (
    <div className="exam-registration">
      <div className="exam-registration__header">
        <h2>
          <FontAwesomeIcon
            icon={faCalendarAlt}
            className="me-2 text-primary"
          />
          Đăng ký thi lần 2
        </h2>
        <p className="text-muted">
          Đăng ký thi lại các môn bạn chưa đạt trong lần thi đầu tiên. Hãy kiểm
          tra kỹ thời hạn và lịch thi dự kiến.
        </p>
      </div>

      <div className="exam-registration__filter d-flex gap-4 flex-wrap my-4">
        <Form.Group>
          <Form.Label>Năm học:</Form.Label>
          <Form.Select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          >
            <option>2024-2025</option>
            <option>2023-2024</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Học kỳ:</Form.Label>
          <Form.Select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option>Học kỳ 1</option>
            <option>Học kỳ 2</option>
          </Form.Select>
        </Form.Group>
      </div>

      {reExamSubjects.length === 0 ? (
        <Alert
          variant="warning"
          className="exam-registration__empty shadow-sm"
        >
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="me-2 text-danger"
          />
          Không có môn học nào cần đăng ký thi lại trong học kỳ này.
          <div className="mt-2 text-secondary small">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="me-1"
            />
            Nếu bạn nghĩ có sai sót, vui lòng kiểm tra{" "}
            <strong>Kết quả học tập</strong> hoặc liên hệ cố vấn học tập.
          </div>
        </Alert>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
        >
          <thead>
            <tr className="text-center">
              <th>STT</th>
              <th>Mã lớp</th>
              <th>Tên lớp</th>
              <th>Điểm (L1)</th>
              <th>Ngày thi L2</th>
              <th>Giờ thi</th>
              <th>Hạn đăng ký</th>
              <th>Ghi chú</th>
              <th>Tình trạng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reExamSubjects.map((subject, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{subject.code}</td>
                <td>{subject.name}</td>
                <td>{subject.score1st}</td>
                <td>{subject.examDate}</td>
                <td>{subject.examTime}</td>
                <td>{subject.deadline}</td>
                <td>{subject.note}</td>
                <td>{subject.status}</td>
                <td>
                  <Button
                    size="sm"
                    variant="primary"
                  >
                    Đăng ký
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ExamRegistration;
