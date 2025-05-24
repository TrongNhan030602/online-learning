/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faThumbsUp,
  faScaleBalanced,
  faTriangleExclamation,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

import learningResultApi from "@/api/learningResultApi";

const LearningResultModal = ({ show, onClose, programId, userId }) => {
  const [loading, setLoading] = useState(false);
  const [learningResults, setLearningResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && programId && userId) {
      setLoading(true);
      learningResultApi
        .getByProgramUser({ programId, userId })
        .then((res) => {
          setLearningResults(res.data?.data || []);
          setError("");
        })
        .catch((err) => {
          setError("Lỗi tải kết quả học tập.");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [show, programId, userId]);

  // Hàm render điểm theo từng học kỳ hoặc tổng (semester_id = null)
  const renderResults = () => {
    if (learningResults.length === 0) {
      return (
        <tr>
          <td
            colSpan={4}
            className="text-center text-muted py-3"
          >
            Chưa có dữ liệu điểm.
          </td>
        </tr>
      );
    }

    // Tách kết quả học kỳ và kết quả tổng
    const semesterResults = learningResults
      .filter((res) => res.semester)
      .sort((a, b) => (a.semester.name > b.semester.name ? 1 : -1));

    const summaryResult = learningResults.find((res) => !res.semester);
    const getBadgeVariant = (classification) => {
      switch ((classification || "").toLowerCase()) {
        case "excellent":
          return "success";
        case "good":
          return "info";
        case "average":
          return "warning";
        case "weak":
          return "danger";
        default:
          return "secondary";
      }
    };

    const getIcon = (classification) => {
      switch ((classification || "").toLowerCase()) {
        case "excellent":
          return faStar;
        case "good":
          return faThumbsUp;
        case "average":
          return faScaleBalanced;
        case "weak":
          return faTriangleExclamation;
        default:
          return faQuestion;
      }
    };

    const renderRow = (result, isSummary = false) => {
      const semesterName = isSummary
        ? "Tổng kết toàn chương trình"
        : result.semester.name;

      return (
        <tr
          key={result.id}
          className={isSummary ? "fw-bold table-light" : ""}
        >
          <td>{semesterName}</td>
          <td>{result.average_score ?? "-"}</td>
          <td>{result.gpa ?? "-"}</td>
          <td>
            <span
              className={`badge bg-${getBadgeVariant(
                result.classification
              )} d-inline-flex align-items-center gap-1`}
            >
              <FontAwesomeIcon icon={getIcon(result.classification)} />
              {result.classification ?? "-"}
            </span>
          </td>
        </tr>
      );
    };

    return (
      <>
        {semesterResults.map((res) => renderRow(res))}
        {summaryResult && renderRow(summaryResult, true)}
      </>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Kết quả học tập</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <div className="text-danger text-center">{error}</div>
        ) : (
          <Table
            bordered
            hover
            responsive
            className="align-middle text-center"
          >
            <thead className="table-secondary">
              <tr>
                <th>Học kỳ</th>
                <th>Điểm TB</th>
                <th>GPA</th>
                <th>Xếp loại</th>
              </tr>
            </thead>
            <tbody>{renderResults()}</tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LearningResultModal;
