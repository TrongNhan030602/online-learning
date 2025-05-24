import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Accordion, Button, Form, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faListCheck,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

import { useToast } from "@/hooks/useToast";
import trainingProgramApi from "@/api/trainingProgramApi";
import disciplineScoreApi from "@/api/disciplineScoreApi";
import "../../../styles/discipline-scores/admin-enter-discipline-scores.css";

const AdminEnterDisciplineScores = () => {
  const { programId } = useParams();
  const [semesters, setSemesters] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});
  const [programName, setProgramName] = useState("");
  const [programCode, setProgramCode] = useState("");
  const [loadingStudentIds, setLoadingStudentIds] = useState([]);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await trainingProgramApi.getSemesters(programId);
        setProgramName(response.data.data.program_name);
        setProgramCode(response.data.data.program_code);
        setSemesters(response.data.data.semesters);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách học kỳ:", error);
      }
    };

    fetchSemesters();
  }, [programId]);

  const fetchStudentsWithoutScores = async (semester) => {
    try {
      const response = await trainingProgramApi.getStudentsWithoutScores(
        programId,
        semester.id
      );
      setStudentsMap((prev) => ({
        ...prev,
        [semester.id]: response.data.data,
      }));
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách sinh viên:", error);
    }
  };

  const handleEnterScore = async (
    semesterId,
    studentTrainingProgramId,
    score,
    evaluation
  ) => {
    const parsedScore = parseFloat(score);
    if (
      isNaN(parsedScore) ||
      parsedScore < 0 ||
      parsedScore > 100 ||
      !evaluation.trim()
    ) {
      addToast({
        title: "Lỗi nhập điểm",
        message: "Vui lòng nhập điểm từ 0 đến 100 và đánh giá hợp lệ.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setLoadingStudentIds((prev) => [...prev, studentTrainingProgramId]);

    try {
      await disciplineScoreApi.createDisciplineScore({
        student_training_program_id: studentTrainingProgramId,
        semester_id: semesterId,
        score: parsedScore,
        evaluation,
      });

      addToast({
        title: "Nhập điểm thành công",
        message: "Điểm rèn luyện đã được lưu",
        type: "success",
        duration: 2000,
      });

      setStudentsMap((prev) => ({
        ...prev,
        [semesterId]: prev[semesterId].filter(
          (s) => s.id !== studentTrainingProgramId
        ),
      }));
    } catch (error) {
      console.error("❌ Lỗi khi nhập điểm rèn luyện:", error);
      addToast({
        title: "Lỗi",
        message: "Không thể lưu điểm. Vui lòng thử lại.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoadingStudentIds((prev) =>
        prev.filter((id) => id !== studentTrainingProgramId)
      );
    }
  };

  return (
    <div className="admin-enter-discipline-scores container mt-4">
      <h2 className="admin-enter-discipline-scores__header mb-4 text-center">
        <FontAwesomeIcon
          icon={faGraduationCap}
          className="me-2"
        />
        Nhập điểm rèn luyện - {programName} ({programCode})
      </h2>
      <div className="admin-enter-discipline-scores__actions">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="me-2"
          />
          Quay lại
        </Button>

        <Button
          variant="primary"
          onClick={() => navigate("/admin/discipline-scores")}
          className="ms-2"
        >
          <FontAwesomeIcon
            icon={faListCheck}
            className="me-2"
          />
          Cập nhật điểm rèn luyện
        </Button>
      </div>

      <div className="admin-enter-discipline-scores__semester-section">
        <h4>Chọn học kỳ</h4>
        <Accordion
          defaultActiveKey="0"
          className="mb-3"
        >
          {semesters.map((semester, index) => (
            <Accordion.Item
              eventKey={index.toString()}
              key={semester.id}
            >
              <Accordion.Header
                className="admin-enter-discipline-scores__semester-header"
                onClick={() => {
                  if (!studentsMap[semester.id]) {
                    fetchStudentsWithoutScores(semester);
                  }
                }}
              >
                {semester.name}
              </Accordion.Header>
              <Accordion.Body className="admin-enter-discipline-scores__form">
                <h5 className="mb-3">
                  Sinh viên chưa nhập điểm ({semester.name})
                </h5>

                {studentsMap[semester.id]?.length > 0 ? (
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                  >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Điểm (0 - 100)</th>
                        <th>Đánh giá</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsMap[semester.id].map((student, idx) => (
                        <tr key={student.id}>
                          <td>{idx + 1}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>
                            <Form.Control
                              type="number"
                              name={`score-${student.id}`}
                              placeholder="Điểm"
                              required
                            />
                          </td>
                          <td>
                            <Form.Select
                              name={`evaluation-${student.id}`}
                              defaultValue=""
                              required
                            >
                              <option
                                value=""
                                disabled
                              >
                                -- Chọn đánh giá --
                              </option>
                              <option value="Xuất sắc">Xuất sắc</option>
                              <option value="Tốt">Tốt</option>
                              <option value="Khá">Khá</option>
                              <option value="Trung bình">Trung bình</option>
                              <option value="Yếu">Yếu</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="success"
                              disabled={loadingStudentIds.includes(
                                student.student_training_program_id
                              )}
                              onClick={() => {
                                const score = document.querySelector(
                                  `[name=score-${student.id}]`
                                ).value;
                                const evaluation = document.querySelector(
                                  `[name=evaluation-${student.id}]`
                                ).value;

                                handleEnterScore(
                                  semester.id,
                                  student.student_training_program_id,
                                  score,
                                  evaluation
                                );
                              }}
                            >
                              {loadingStudentIds.includes(
                                student.student_training_program_id
                              )
                                ? "Đang lưu..."
                                : "Nhập"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="admin-enter-discipline-scores__empty-message">
                    Không còn sinh viên nào cần nhập điểm.
                  </p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default AdminEnterDisciplineScores;
