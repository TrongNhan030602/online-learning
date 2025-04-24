import React from "react";
import { Container, Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../../styles/student/training-program/training-program.css";

const trainingData = [
  {
    semester: "HK I",
    courses: [
      ["MH 01", "Chính trị", 5, 75, 70, 0, 5],
      ["MH 02", "Pháp luật", 2, 30, 18, 10, 2],
      ["MH 05", "Tin học", 3, 75, 15, 58, 2],
      ["MH 06", "Tiếng Anh", 4, 120, 0, 114, 6],
      ["MĐ 07", "Nhập môn Thiết kế đồ họa", 3, 75, 27, 45, 3],
      ["MĐ 08", "Nền tảng mỹ thuật cơ bản (Fundamental)", 2, 60, 15, 42, 3],
    ],
  },
  {
    semester: "HK II",
    courses: [
      ["MH 03", "Giáo dục thể chất", 2, 60, 5, 51, 4],
      ["MH 04", "Giáo dục quốc phòng và an ninh", 3, 75, 15, 56, 4],
      ["MĐ 09", "Kỹ năng vẽ cơ bản - cơ sở tạo hình", 5, 120, 45, 70, 5],
      ["MĐ 10", "Adobe Photoshop: Xử lý hình ảnh", 4, 90, 30, 57, 3],
      ["MĐ 11", "Adobe Illustrator: Tạo hình Vector", 4, 90, 30, 57, 3],
      ["MĐ 12", "Adobe InDesign: Thiết kế dàn trang", 3, 75, 15, 57, 3],
    ],
  },
  {
    semester: "HK III",
    courses: [
      ["MĐ 13", "Typography - Nghệ thuật thiết kế chữ", 3, 75, 15, 57, 3],
      ["MĐ 14", "Kỹ thuật nhiếp ảnh & chỉnh sửa ảnh căn bản", 2, 45, 15, 28, 2],
      [
        "MĐ 15",
        "Thiết kế Nhận diện thương hiệu và truyền thông quảng cáo",
        3,
        75,
        15,
        57,
        3,
      ],
      ["MĐ 16", "Kỹ thuật in ấn", 2, 45, 15, 28, 2],
      ["MĐ 17", "Thiết kế đồ họa 3D", 3, 75, 15, 57, 3],
      ["MĐ 18", "Adobe Premiere & After Effects căn bản", 4, 90, 30, 56, 4],
    ],
  },
  {
    semester: "HK IV",
    courses: [
      ["MĐ 19", "UX/UI design", 4, 90, 30, 56, 4],
      ["MĐ 25", "Ứng dụng thiết kế Digital", 2, 45, 15, 27, 3],
      ["MĐ 20", "Dựng phim hoạt hình căn bản", 4, 90, 30, 56, 4],
      ["MĐ 21", "Xây dựng thương hiệu cá nhân", 3, 75, 15, 57, 3],
      ["MĐ 22", "Dự án nhóm", 4, 90, 15, 72, 3],
    ],
  },
  {
    semester: "HK V",
    courses: [
      ["MĐ 24", "Ứng dụng AI trong thiết kế", 2, 45, 15, 26, 4],
      ["MĐ 23", "Thực hành thiết kế trong doanh nghiệp", 5, 225, 0, 223, 2],
      ["MĐ 26", "Đồ án tốt nghiệp", 6, 270, 0, 264, 6],
    ],
  },
];

const TrainingProgram = () => {
  const navigate = useNavigate();

  const handleLearn = () => {
    // const sanitizedCode = code.replace(/\s/g, "");
    // navigate(`/study/${code}`);
    navigate(`/student/my-classes/15`);
  };

  const totals = {
    credits: 0,
    totalHours: 0,
    theory: 0,
    practice: 0,
    exam: 0,
  };

  trainingData.forEach((sem) => {
    sem.courses.forEach(([, , credits, total, theory, practice, exam]) => {
      totals.credits += credits;
      totals.totalHours += total;
      totals.theory += theory;
      totals.practice += practice;
      totals.exam += exam;
    });
  });

  return (
    <div className="training-program">
      <h1 className="training-program__title">
        <FontAwesomeIcon
          icon={faGraduationCap}
          className="me-2"
        />
        Chương Trình Cao Đẳng - Thiết Kế Đồ Họa
      </h1>
      <Container>
        <Table
          bordered
          hover
          responsive
          className="training-program__table"
        >
          <thead>
            <tr>
              <th rowSpan="2">Mã MH/MĐ</th>
              <th rowSpan="2">Tên môn học, mô đun</th>
              <th rowSpan="2">Số tín chỉ</th>
              <th
                colSpan="4"
                className="text-center"
              >
                Thời gian học tập (giờ)
              </th>
              <th rowSpan="2">Học</th>
            </tr>
            <tr>
              <th>Tổng số</th>
              <th>Lý thuyết</th>
              <th>Thực hành/thực tập</th>
              <th>Thi/Kiểm tra</th>
            </tr>
          </thead>
          <tbody>
            {trainingData.map((semester, idx) => (
              <React.Fragment key={idx}>
                <tr className="table-secondary">
                  <td colSpan="8">
                    <strong>{semester.semester}</strong>
                  </td>
                </tr>
                {semester.courses.map((course, i) => (
                  <tr key={i}>
                    <td>{course[0]}</td>
                    <td>{course[1]}</td>
                    <td>{course[2]}</td>
                    <td>{course[3]}</td>
                    <td>{course[4]}</td>
                    <td>{course[5]}</td>
                    <td>{course[6]}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleLearn(course[0])}
                      >
                        <FontAwesomeIcon
                          icon={faBookOpen}
                          className="me-1"
                        />
                        Học
                      </Button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr className="table-success fw-bold">
              <td colSpan="2">Tổng cộng</td>
              <td>{totals.credits}</td>
              <td>{totals.totalHours}</td>
              <td>{totals.theory}</td>
              <td>{totals.practice}</td>
              <td>{totals.exam}</td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default TrainingProgram;
