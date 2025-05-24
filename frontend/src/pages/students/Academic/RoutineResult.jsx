import { useEffect, useState } from "react";
import { Accordion, Card, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faStar,
  faThumbsUp,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import disciplineScoreApi from "@/api/disciplineScoreApi"; // Đảm bảo import API đúng

import "../../../styles/student/academic/routine-result.css";

const RoutineResult = () => {
  const [routineResults, setRoutineResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchDisciplineScores = async () => {
      try {
        const response = await disciplineScoreApi.getDisciplineScoreByStudent();
        const data = response.data;

        // Sắp xếp mảng semesters theo thứ tự học kỳ
        Object.keys(data).forEach((programKey) => {
          const program = data[programKey];

          if (program.semesters && Array.isArray(program.semesters)) {
            program.semesters.sort((a, b) => {
              // Lấy số học kỳ từ chuỗi "Học kỳ 01"
              const numA = parseInt(a.semester.match(/\d+/)?.[0] || 0);
              const numB = parseInt(b.semester.match(/\d+/)?.[0] || 0);
              return numA - numB;
            });
          }
        });

        setRoutineResults(data); // Cập nhật state với dữ liệu đã sắp xếp
      } catch (error) {
        console.error(error);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplineScores();
  }, []);

  if (loading) {
    return <div className="text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="routine-result">
      <h2 className="routine-result__title">
        <FontAwesomeIcon icon={faStar} /> Điểm rèn luyện sinh viên
      </h2>
      <Accordion defaultActiveKey="0">
        {Object.entries(routineResults).map(
          ([programName, programData], index) => (
            <Card
              key={index}
              className="mb-3"
            >
              <Accordion.Item eventKey={String(index)}>
                <Accordion.Header>
                  <FontAwesomeIcon
                    icon={faBook}
                    className="mx-1"
                  />
                  {programName}
                </Accordion.Header>
                <Accordion.Body>
                  {/* Hiển thị điểm trung bình và xếp loại chung toàn khóa */}
                  <div className="mb-3">
                    <strong>Điểm trung bình toàn khóa:</strong>{" "}
                    {programData.averageScore}
                    <br />
                    <strong>Xếp loại chung toàn khóa:</strong>{" "}
                    {programData.overallRank}
                  </div>

                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="routine-result__table"
                  >
                    <thead>
                      <tr>
                        <th>
                          <FontAwesomeIcon icon={faCalendarAlt} /> Học kỳ
                        </th>
                        <th>
                          <FontAwesomeIcon icon={faStar} /> Tổng điểm
                        </th>
                        <th>
                          <FontAwesomeIcon icon={faThumbsUp} /> Xếp loại
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {programData.semesters.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.semester}</td>
                          <td>{item.totalScore}</td>
                          <td>{item.rank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          )
        )}
      </Accordion>
    </div>
  );
};

export default RoutineResult;
