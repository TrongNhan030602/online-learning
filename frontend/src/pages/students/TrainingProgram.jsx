import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import studentTrainingApi from "../../api/studentTrainingApi"; // Import API
import "../../styles/student/training-program/training-program.css";

const TrainingProgram = () => {
  const { id } = useParams(); // `id` là tham số trong URL
  const programId = id;
  const [trainingData, setTrainingData] = useState(null); // State for storing program data
  const [totals, setTotals] = useState({
    credits: 0,
    totalHours: 0,
    theory: 0,
    practice: 0,
    exam: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        const response = await studentTrainingApi.getProgramDetail(programId);
        const data = response.data.data;
        setTrainingData(data); // Set toàn bộ dữ liệu chương trình đào tạo
        calculateTotals(data); // Tính tổng các giờ học và tín chỉ
      } catch (error) {
        console.error("Error fetching program detail:", error);
      }
    };

    fetchProgramDetail();
  }, [programId]);

  const calculateTotals = (data) => {
    const newTotals = {
      credits: 0,
      totalHours: 0,
      theory: 0,
      practice: 0,
      exam: 0,
    };

    if (
      data.level === "certificate" ||
      data.level === "specialized" ||
      data.level === "software"
    ) {
      // Nếu không có học kỳ (certificate, specialized, software), sử dụng chương trình môn học trực tiếp
      data.program_courses.forEach((course) => {
        newTotals.credits += course.credits;
        newTotals.totalHours += course.total_hours;
        newTotals.theory += course.theory_hours;
        newTotals.practice += course.practice_hours;
        newTotals.exam += course.exam_hours;
      });
    } else {
      // Nếu có học kỳ, tính toán qua từng học kỳ
      data.semesters.forEach((semester) => {
        semester.courses.forEach((course) => {
          newTotals.credits += course.credits;
          newTotals.totalHours += course.total_hours;
          newTotals.theory += course.theory_hours;
          newTotals.practice += course.practice_hours;
          newTotals.exam += course.exam_hours;
        });
      });
    }

    setTotals(newTotals);
  };

  const handleLearn = (courseId) => {
    navigate(`/student/my-course/${courseId}`);
  };

  if (!trainingData) return <div>Loading...</div>; // Show loading if data is not yet available

  return (
    <div className="training-program">
      <h1 className="training-program__title">
        <FontAwesomeIcon
          icon={faGraduationCap}
          className="me-2"
        />
        {trainingData.name}
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
            {trainingData.level === "certificate" ||
            trainingData.level === "specialized" ||
            trainingData.level === "software" ? (
              // Hiển thị môn học trực tiếp nếu không có học kỳ
              <React.Fragment>
                <tr className="table-secondary">
                  <td colSpan="8">
                    <strong>
                      Không có học kỳ. Danh sách môn học chương trình:
                    </strong>
                  </td>
                </tr>
                {trainingData.program_courses.map((course, i) => (
                  <tr key={i}>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.credits}</td>
                    <td>{course.total_hours}</td>
                    <td>{course.theory_hours}</td>
                    <td>{course.practice_hours}</td>
                    <td>{course.exam_hours}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleLearn(course.id)}
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
            ) : (
              // Nếu có học kỳ, hiển thị môn học theo từng học kỳ
              trainingData.semesters.map((semester, idx) => (
                <React.Fragment key={idx}>
                  <tr className="table-secondary">
                    <td colSpan="8">
                      <strong>{semester.name}</strong>
                    </td>
                  </tr>
                  {semester.courses.map((course, i) => (
                    <tr key={i}>
                      <td>{course.code}</td>
                      <td>{course.name}</td>
                      <td>{course.credits}</td>
                      <td>{course.total_hours}</td>
                      <td>{course.theory_hours}</td>
                      <td>{course.practice_hours}</td>
                      <td>{course.exam_hours}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleLearn(course.id)}
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
              ))
            )}
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
