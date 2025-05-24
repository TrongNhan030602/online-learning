/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import scoreApi from "@/api/scoreApi";
import studentTrainingProgramApi from "@/api/studentTrainingProgramApi";
import { useToast } from "@/hooks/useToast";

const BulkScoreInputModal = ({
  show,
  onClose,
  trainingProgramId,
  semesterId,
  course,
  onSuccess,
}) => {
  const [students, setStudents] = useState([]);
  const [scoresData, setScoresData] = useState([]);
  const { addToast } = useToast();

  const resetData = () => {
    setStudents([]);
    setScoresData([]);
  };

  const fetchStudents = useCallback(async () => {
    if (!trainingProgramId || !course?.id) return;

    try {
      const res = await studentTrainingProgramApi.getStudentsInProgram(
        trainingProgramId
      );
      const studentList = res.data.data;

      const scoreRes = await scoreApi.getScoresByProgramAndCourse(
        trainingProgramId,
        course.id,
        semesterId
      );
      const existingScores = scoreRes.data?.data || [];

      // Map điểm theo student_training_program_id
      const scoreMap = {};
      for (const score of existingScores) {
        const stpId = score.student_training_program_id;
        if (!scoreMap[stpId]) {
          scoreMap[stpId] = {};
        }
        scoreMap[stpId][score.score_type] = score.value;
      }

      // Tạo danh sách điểm đầu vào cho form
      const formatted = studentList.map((s) => {
        const existing = scoreMap[s.id] || {};
        return {
          user_id: s.user.id,
          student_training_program_id: s.id,
          scores: {
            quiz: existing.quiz ?? 0,
            midterm: existing.midterm ?? 0,
            final: existing.final ?? 0,
          },
        };
      });

      setStudents(studentList);
      setScoresData(formatted);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học viên hoặc điểm:", error);
    }
  }, [trainingProgramId, course?.id, semesterId]);

  useEffect(() => {
    if (show && course?.id) {
      fetchStudents();
    } else {
      resetData(); // reset khi đóng modal hoặc course đổi
    }
  }, [show, course?.id, fetchStudents]);

  // Cập nhật điểm theo student_training_program_id
  const handleScoreChangeByStpId = (stpId, type, value) => {
    setScoresData((prev) =>
      prev.map((entry) =>
        entry.student_training_program_id === stpId
          ? {
              ...entry,
              scores: {
                ...entry.scores,
                [type]: value,
              },
            }
          : entry
      )
    );
  };

  const handleSubmit = async () => {
    try {
      await scoreApi.saveBulkScores({
        course_id: course.id,
        semester_id: semesterId,
        attempt: 1,
        bulk_scores: scoresData,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      addToast({
        title: "Lỗi",
        message: "Không thể lưu điểm hàng loạt",
        duration: 1500,
        type: "error",
      });
      console.error(error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Nhập điểm cho môn:{" "}
          <strong>
            {course?.title} - {course?.code}
          </strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table
          bordered
          responsive
        >
          <thead>
            <tr>
              <th>Mã SV</th>
              <th>Email</th>
              <th>Kiểm tra thường xuyên</th>
              <th>Giữa kỳ</th>
              <th>Cuối kỳ</th>
              <th>TB KT + GK</th>
              <th>ĐTB</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const matchedScore = scoresData.find(
                (s) => s.student_training_program_id === student.id
              );
              const score = matchedScore?.scores ?? {
                quiz: "",
                midterm: "",
                final: "",
              };

              const quiz = parseFloat(score.quiz || 0);
              const midterm = parseFloat(score.midterm || 0);
              const final = parseFloat(score.final || 0);
              const avgScore = (quiz * 1 + midterm * 2) / 3;

              const totalScore =
                ((quiz * 1 + midterm * 2) / 3) * 0.4 + final * 0.6;

              return (
                <tr key={student.id}>
                  <td>{student.user.name}</td>
                  <td>{student.user.email}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      max="10"
                      value={score.quiz}
                      onChange={(e) =>
                        handleScoreChangeByStpId(
                          student.id,
                          "quiz",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      max="10"
                      value={score.midterm}
                      onChange={(e) =>
                        handleScoreChangeByStpId(
                          student.id,
                          "midterm",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      max="10"
                      value={score.final}
                      onChange={(e) =>
                        handleScoreChangeByStpId(
                          student.id,
                          "final",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>{avgScore.toFixed(2)}</td>
                  <td>{totalScore.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Đóng
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
        >
          Lưu điểm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BulkScoreInputModal;
