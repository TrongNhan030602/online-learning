import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faStar,
  faThumbsUp,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../../../styles/student/academic/routine-result.css";

const RoutineResult = () => {
  const routineResults = [
    { semester: "Học kỳ 1 - 2023", totalScore: 85, rank: "Tốt" },
    { semester: "Học kỳ 2 - 2023", totalScore: 92, rank: "Xuất sắc" },
    { semester: "Học kỳ 1 - 2024", totalScore: 78, rank: "Khá" },
    { semester: "Học kỳ 2 - 2024", totalScore: 88, rank: "Tốt" },
  ];

  return (
    <div className="routine-result">
      <h2 className="routine-result__title">
        <FontAwesomeIcon icon={faStar} /> Điểm rèn luyện sinh viên
      </h2>
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
              <FontAwesomeIcon icon={faBook} /> STT
            </th>
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
          {routineResults.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.semester}</td>
              <td>{item.totalScore}</td>
              <td>{item.rank}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RoutineResult;
