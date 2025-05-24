import { useEffect, useState } from "react";
import { Accordion, Table } from "react-bootstrap";
import learningResultApi from "@/api/learningResultApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/student/academic/learning-result.css";

const LearningResult = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningResults = async () => {
      try {
        const res = await learningResultApi.getMyLearningResult();
        setData(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải dữ liệu kết quả học tập.");
      } finally {
        setLoading(false);
      }
    };
    fetchLearningResults();
  }, []);

  if (loading)
    return <div className="text-center my-4">Đang tải dữ liệu...</div>;

  if (error) return <div className="text-danger text-center my-4">{error}</div>;

  if (!data.length)
    return (
      <div className="text-center my-4">Không có dữ liệu kết quả học tập.</div>
    );

  // Hàm format số: nếu là số thì giữ 2 chữ số thập phân, else giữ nguyên
  const formatScore = (score) =>
    typeof score === "number" ? score.toFixed(2) : score ?? "-";

  // Hàm chuẩn hóa phân loại (viết hoa chữ cái đầu)

  const formatClassification = (classification) => {
    if (!classification) return "-";

    const mapping = {
      excellent: "Xuất sắc",
      good: "Giỏi",
      average: "Trung bình",
      poor: "Kém",
    };

    const normalized = classification.toLowerCase().replace(/\s+/g, "_");

    return mapping[normalized] || classification;
  };

  return (
    <div className="learning-result container">
      <h2 className="learning-result__title">
        <FontAwesomeIcon icon={faGraduationCap} /> Kết quả học tập
      </h2>

      <Accordion defaultActiveKey="0">
        {data.map((programItem, idxProgram) => (
          <Accordion.Item
            eventKey={idxProgram.toString()}
            key={programItem.student_training_program_id}
            className="m-2"
          >
            <Accordion.Header>
              {programItem.program.name} ({programItem.program.code})
            </Accordion.Header>
            <Accordion.Body>
              {programItem.learning_results.length === 0 && (
                <p className="text-muted fst-italic">
                  Chưa có kết quả học tập cho chương trình này.
                </p>
              )}

              {programItem.learning_results.map((lr) => {
                const isSummary = !lr.semester;
                const hasCourses =
                  lr.course_results && lr.course_results.length > 0;

                return (
                  <div
                    key={lr.id}
                    className="mb-5"
                  >
                    <h5>
                      {isSummary
                        ? programItem.program.level === "certificate"
                          ? "Tổng kết chương trình (bậc chứng chỉ)"
                          : "Tổng kết chương trình"
                        : lr.semester.name}
                    </h5>
                    <p>
                      <strong>Điểm trung bình:</strong>{" "}
                      {formatScore(lr.average_score)} | <strong>GPA:</strong>{" "}
                      {formatScore(lr.gpa)} | <strong>Phân loại:</strong>{" "}
                      {formatClassification(lr.classification)}
                    </p>

                    {!hasCourses ? (
                      <p className="fst-italic text-secondary">
                        {isSummary
                          ? " "
                          : "Không có môn học nào trong học kỳ này."}
                      </p>
                    ) : (
                      <Table
                        striped
                        bordered
                        hover
                        responsive
                      >
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Mã môn học</th>
                            <th>Tên môn học</th>
                            <th>Điểm thường xuyên</th>
                            <th>Điểm giữa kỳ</th>
                            <th>Điểm Cuối kỳ</th>
                            <th>Điểm trung bình</th>
                            <th>Phân loại</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lr.course_results.map((courseRes, idxCourse) => (
                            <tr key={courseRes.id}>
                              <td>{idxCourse + 1}</td>
                              <td>{courseRes.course.code}</td>
                              <td>{courseRes.course.title}</td>
                              <td>
                                {formatScore(courseRes.scores_detail?.quiz)}
                              </td>
                              <td>
                                {formatScore(courseRes.scores_detail?.midterm)}
                              </td>
                              <td>
                                {formatScore(courseRes.scores_detail?.final)}
                              </td>
                              <td>{formatScore(courseRes.average_score)}</td>
                              <td>
                                {formatClassification(courseRes.classification)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                );
              })}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default LearningResult;
