import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faPenAlt,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/useToast";

import examScheduleApi from "@/api/examScheduleApi";
import RetakeExamModal from "@/components/Student/Exam/RetakeExamModal";
import "../../../styles/student/academic/exam-schedule.css";

const ExamSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const { addToast } = useToast();

  const [error, setError] = useState(null);

  useEffect(() => {
    examScheduleApi
      .getMySchedules()
      .then((response) => {
        setSchedule(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải lịch thi");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không có";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    return `${hour}:${minute}`;
  };

  // Nhóm dữ liệu theo tên chương trình
  const groupedByProgram = schedule.reduce((acc, item) => {
    const program = item.training_program.program_name;
    if (!acc[program]) acc[program] = [];
    acc[program].push(item);
    return acc;
  }, {});

  if (loading) {
    return <p className="text-muted text-center">Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="exam-schedule">
      <h2 className="exam-schedule__title">
        <FontAwesomeIcon icon={faCalendarDay} /> Lịch thi
      </h2>

      <div className="exam-schedule__scroll-container">
        {Object.entries(groupedByProgram).map(([programName, items]) => (
          <div
            key={programName}
            className="exam-schedule__group"
          >
            <h4 className="exam-schedule__group-title">{programName}</h4>
            <Table
              striped
              bordered
              hover
              responsive
              className="exam-schedule__table"
            >
              <thead>
                <tr>
                  <th>
                    <FontAwesomeIcon icon={faPenAlt} /> STT
                  </th>
                  <th>Mã học phần</th>
                  <th>Tên học phần</th>
                  <th>Số tín chỉ</th>
                  <th>Tổng giờ</th>
                  <th>Mã CTĐT</th>
                  <th>Chương trình đào tạo</th>
                  <th>Loại kỳ thi</th>
                  <th>Ngày thi</th>
                  <th>Giờ thi</th>
                  <th>Thời lượng</th>
                  <th>Phòng thi</th>
                  <th>Ngày thi Lần 2(dự kiến)</th>
                  <th>Giờ thi Lần 2(dự kiến)</th>
                  <th>Học kỳ</th>
                  <th>Ghi chú</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.course.course_code}</td>
                    <td>{item.course.course_title}</td>
                    <td>{item.course.credits}</td>
                    <td>{item.course.total_hours}</td>
                    <td>{item.training_program.program_code}</td>
                    <td>{item.training_program.program_name}</td>
                    <td>
                      {item.exam_details.exam_type === "midterm"
                        ? "Giữa kỳ"
                        : "Cuối kỳ"}
                    </td>
                    <td>{formatDate(item.exam_details.exam_date)}</td>
                    <td>
                      {formatTime(item.exam_details.start_time)} -{" "}
                      {formatTime(item.exam_details.end_time)}
                    </td>
                    <td>{item.exam_details.duration_minutes} phút</td>
                    <td>{item.exam_details.location}</td>
                    <td>
                      {formatDate(item.retake_exam_details.retake_exam_date)}
                    </td>
                    <td>
                      {item.retake_exam_details.retake_start_time
                        ? `${formatTime(
                            item.retake_exam_details.retake_start_time
                          )} - ${formatTime(
                            item.retake_exam_details.retake_end_time
                          )}`
                        : "Không có"}
                    </td>
                    <td>{item.semester.semester_name || "Không có"}</td>
                    <td>{item.exam_details.note}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center"
                        onClick={() => {
                          setSelectedExam(item);
                          setShowRetakeModal(true);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPen}
                          style={{ marginRight: "6px" }}
                        />
                        Đăng ký thi lại
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ))}
      </div>
      <RetakeExamModal
        show={showRetakeModal}
        onHide={() => setShowRetakeModal(false)}
        exam={selectedExam}
        onSuccess={() => {
          addToast({
            title: "Thành công",
            message: "Đã gửi yêu cầu đăng ký thi lại",
            type: "success",
            duration: 1500,
          });
        }}
      />
    </div>
  );
};

export default ExamSchedule;
