// src/pages/students/Academic/LearningResult.jsx
import { Accordion, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faListAlt } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/student/academic/learning-result.css";

const data = [
  {
    year: "2023-2024",
    semester: "HK I",
    subjects: [
      {
        code: "MH01",
        name: "Chính trị",
        credits: 5,
        score10: 8.2,
        score4: 3.3,
        letter: "B+",
        result: "Đậu",
      },
      {
        code: "MH02",
        name: "Pháp luật",
        credits: 2,
        score10: 7.5,
        score4: 3.0,
        letter: "B",
        result: "Đậu",
      },
      {
        code: "MH05",
        name: "Tin học",
        credits: 3,
        score10: 8.0,
        score4: 3.2,
        letter: "B+",
        result: "Đậu",
      },
      {
        code: "MH06",
        name: "Tiếng Anh",
        credits: 4,
        score10: 6.8,
        score4: 2.5,
        letter: "C+",
        result: "Đậu",
      },
      {
        code: "MĐ07",
        name: "Nhập môn Thiết kế đồ họa",
        credits: 3,
        score10: 8.5,
        score4: 3.5,
        letter: "A",
        result: "Đậu",
      },
      {
        code: "MĐ08",
        name: "Nền tảng mỹ thuật cơ bản (Fundamental)",
        credits: 2,
        score10: 7.9,
        score4: 3.1,
        letter: "B+",
        result: "Đậu",
      },
    ],
    summary: {
      totalCredits: 19,
      gpa10: "7.8",
      gpa4: "3.1",
      conduct: "Tốt",
    },
  },
  {
    year: "2023-2024",
    semester: "HK II",
    subjects: [
      {
        code: "MH03",
        name: "Giáo dục thể chất",
        credits: 2,
        score10: 9.0,
        score4: 4.0,
        letter: "A+",
        result: "Đậu",
      },
      {
        code: "MH04",
        name: "Giáo dục quốc phòng và an ninh",
        credits: 3,
        score10: 8.5,
        score4: 3.5,
        letter: "A",
        result: "Đậu",
      },
      {
        code: "MĐ09",
        name: "Kỹ năng vẽ cơ bản - cơ sở tạo hình",
        credits: 5,
        score10: 8.2,
        score4: 3.3,
        letter: "B+",
        result: "Đậu",
      },
      {
        code: "MĐ10",
        name: "Adobe Photoshop: Xử lý hình ảnh",
        credits: 4,
        score10: 8.0,
        score4: 3.2,
        letter: "B+",
        result: "Đậu",
      },
      {
        code: "MĐ11",
        name: "Adobe Illustrator: Tạo hình Vector",
        credits: 4,
        score10: 7.5,
        score4: 3.0,
        letter: "B",
        result: "Đậu",
      },
      {
        code: "MĐ12",
        name: "Adobe InDesign: Thiết kế dàn trang",
        credits: 3,
        score10: 8.0,
        score4: 3.2,
        letter: "B+",
        result: "Đậu",
      },
    ],
    summary: {
      totalCredits: 21,
      gpa10: "8.2",
      gpa4: "3.4",
      conduct: "Tốt",
    },
  },
];

const LearningResult = () => {
  return (
    <div className="learning-result">
      <h2 className="learning-result__title">
        <FontAwesomeIcon icon={faGraduationCap} /> Kết quả học tập
      </h2>
      <Accordion defaultActiveKey="0">
        {data.map((term, index) => (
          <Accordion.Item
            eventKey={index.toString()}
            key={index}
          >
            <Accordion.Header>
              Năm học: {term.year} - Học kỳ: {term.semester}
            </Accordion.Header>
            <Accordion.Body>
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
                    <th>Tín chỉ</th>
                    <th>Điểm (Hệ 10)</th>
                    <th>Điểm (Hệ 4)</th>
                    <th>Điểm chữ</th>
                    <th>Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  {term.subjects.map((subj, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{subj.code}</td>
                      <td>{subj.name}</td>
                      <td>{subj.credits}</td>
                      <td>{subj.score10 ?? "-"}</td>
                      <td>{subj.score4 ?? "-"}</td>
                      <td>{subj.letter ?? "-"}</td>
                      <td>{subj.result}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="learning-result__summary">
                <p>
                  <FontAwesomeIcon icon={faListAlt} /> Tổng tín chỉ đạt:{" "}
                  <strong>{term.summary.totalCredits}</strong>
                </p>
                <p>Điểm trung bình (Hệ 10): {term.summary.gpa10}</p>
                <p>Điểm trung bình (Hệ 4): {term.summary.gpa4}</p>
                <p>Rèn luyện học kỳ: {term.summary.conduct}</p>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default LearningResult;
