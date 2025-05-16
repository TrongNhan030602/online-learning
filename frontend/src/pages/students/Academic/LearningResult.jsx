import { useEffect, useState } from "react";
import { Accordion, Table } from "react-bootstrap";
import scoreApi from "@/api/scoreApi"; // Đường dẫn tới file scoreApi.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/student/academic/learning-result.css";

const scoreTypeMap = {
  final: "Cuối kỳ",
  quiz: "Kiểm tra nhanh",
  midterm: "Giữa kỳ",
  assignment: "Bài tập",
};

const LearningResult = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await scoreApi.getMyScores();
        setData(res.data.data); // Lấy mảng data bên trong response
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải dữ liệu điểm");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  // Chuyển semesters object thành mảng và sắp xếp theo key (id học kỳ)
  const semestersToArray = (semesters) =>
    Object.entries(semesters)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([semesterId, scores]) => ({ semesterId, scores }));

  if (loading)
    return <div className="text-center my-4">Đang tải dữ liệu...</div>;

  if (error) return <div className="text-danger">{error}</div>;

  if (!data || data.length === 0) return <div>Không có dữ liệu điểm</div>;

  return (
    <div className="learning-result">
      <h2 className="learning-result__title">
        <FontAwesomeIcon icon={faGraduationCap} /> Kết quả học tập
      </h2>
      <Accordion defaultActiveKey="0">
        {data.map((program, i) => (
          <Accordion.Item
            eventKey={i.toString()}
            key={program.training_program.id}
          >
            <Accordion.Header>
              {program.training_program.name} ({program.training_program.code})
            </Accordion.Header>
            <Accordion.Body>
              {semestersToArray(program.semesters).map(
                ({ semesterId, scores }) => (
                  <div
                    key={semesterId}
                    style={{ marginBottom: "2rem" }}
                  >
                    <h5>
                      Học kỳ:{" "}
                      {scores[0].semester
                        ? scores[0].semester.name
                        : "Không có"}
                    </h5>
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
                          <th>Loại điểm</th>
                          <th>Điểm</th>
                          <th>Lần thi</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((score, idx) => (
                          <tr key={score.id}>
                            <td>{idx + 1}</td>
                            <td>{score.course.code}</td>
                            <td>{score.course.title}</td>
                            <td>
                              {scoreTypeMap[score.score_type] ||
                                score.score_type}
                            </td>
                            <td>{score.value}</td>
                            <td>{score.attempt}</td>
                            <td>{score.is_accepted ? "Đạt" : "Không đạt"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default LearningResult;
