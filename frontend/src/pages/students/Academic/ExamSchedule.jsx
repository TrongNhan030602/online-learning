import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faPenAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../../../styles/student/academic/exam-schedule.css";

const ExamSchedule = () => {
  const schedule = [
    {
      code: "MH01",
      subject: "Chính trị",
      examDate: "01/06/2025",
      examTime: "08:00",
      room: "A101",
      resitDate: "05/06/2025",
      resitTime: "14:00",
      examType: "Trắc nghiệm",
      duration: "120",
      location: "Học viện Design24",
      term: "Học kỳ 2",
      note: "Không có",
    },
    {
      code: "MH05",
      subject: "Tin học",
      examDate: "02/06/2025",
      examTime: "10:00",
      room: "B202",
      resitDate: "06/06/2025",
      resitTime: "16:00",
      examType: "Tự luận",
      duration: "150",
      location: "Học viện Design24",
      term: "Học kỳ 2",
      note: "Cần chuẩn bị tốt tài liệu",
    },
    {
      code: "MH06",
      subject: "Tiếng Anh",
      examDate: "03/06/2025",
      examTime: "14:00",
      room: "C303",
      resitDate: "07/06/2025",
      resitTime: "10:00",
      examType: "Trắc nghiệm",
      duration: "90",
      location: "Học viện Design24",
      term: "Học kỳ 2",
      note: "Lưu ý mang thẻ sinh viên",
    },
  ];

  return (
    <div className="exam-schedule">
      <h2 className="exam-schedule__title">
        <FontAwesomeIcon icon={faCalendarDay} /> Lịch thi
      </h2>
      <div className="exam-schedule__info">
        <p>
          <strong>Năm học:</strong> 2025 - 2026
        </p>
        <p>
          <strong>Học kỳ:</strong> Học kỳ 2
        </p>
      </div>
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
            <th>
              <FontAwesomeIcon icon={faClock} /> Ngày thi
            </th>
            <th>
              <FontAwesomeIcon icon={faClock} /> Giờ thi
            </th>
            <th>Phòng thi</th>
            <th>Ngày thi (Lần 2) dự kiến</th>
            <th>Giờ thi (Lần 2) dự kiến</th>
            <th>Hình thức thi</th>
            <th>Thời gian làm bài (phút)</th>
            <th>Địa điểm</th>
            <th>Kỳ thi</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.code}</td>
              <td>{item.subject}</td>
              <td>{item.examDate}</td>
              <td>{item.examTime}</td>
              <td>{item.room}</td>
              <td>{item.resitDate}</td>
              <td>{item.resitTime}</td>
              <td>{item.examType}</td>
              <td>{item.duration}</td>
              <td>{item.location}</td>
              <td>{item.term}</td>
              <td>{item.note}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ExamSchedule;
