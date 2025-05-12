import { useEffect, useState } from "react";
import { Accordion, Card, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faStar,
  faThumbsUp,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import disciplineScoreApi from "../../../api/disciplineScoreApi"; // Đảm bảo import API đúng

import "../../../styles/student/academic/routine-result.css";

const RoutineResult = () => {
  const [routineResults, setRoutineResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchDisciplineScores = async () => {
      try {
        const response = await disciplineScoreApi.getDisciplineScoreByStudent();
        const data = response.data; // Dữ liệu trả về từ API

        // Nhóm các kết quả theo chương trình đào tạo, bao gồm cả code
        const groupedResults = data;

        // Sắp xếp học kỳ theo thứ tự
        Object.keys(groupedResults).forEach((key) => {
          const group = groupedResults[key];
          // Sắp xếp các học kỳ trong mỗi nhóm theo thứ tự học kỳ
          const sortedGroup = Object.keys(group)
            .map((semesterKey) => group[semesterKey])
            .sort((a, b) => {
              return (
                parseInt(a.semester.match(/\d+/)[0]) -
                parseInt(b.semester.match(/\d+/)[0])
              );
            });

          // Cập nhật lại nhóm đã sắp xếp
          groupedResults[key] = sortedGroup;
        });

        setRoutineResults(groupedResults); // Cập nhật state với dữ liệu đã sắp xếp
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
        {Object.keys(routineResults).map((programName, index) => (
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
                    {routineResults[programName].map((item, idx) => (
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
        ))}
      </Accordion>
    </div>
  );
};

export default RoutineResult;
