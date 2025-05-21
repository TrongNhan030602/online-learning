/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/useToast";

import { Collapse, Card, Button } from "react-bootstrap";

import scoreApi from "@/api/scoreApi";
import ConfirmDialog from "@/components/Common/ConfirmDialog";
import Loading from "@/components/common/Loading";
import EditScoreModal from "@/components/Scores/EditScoreModal";
import "../../../styles/scores/admin-scores.css";

const AdminScores = () => {
  const [groupedScores, setGroupedScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [scoreToDelete, setScoreToDelete] = useState(null);
  const { addToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [scoreToEdit, setScoreToEdit] = useState(null);
  // State quản lý collapse
  const [openTP, setOpenTP] = useState({});
  const [openSemester, setOpenSemester] = useState({});

  // Hàm fetch điểm và gom nhóm theo chương trình & học kỳ
  const fetchScores = async () => {
    try {
      setLoading(true);
      const res = await scoreApi.getAllScores();
      const scores = res.data.data;

      const grouped = {};

      scores.forEach((score) => {
        const tpId = score.training_program.id;
        const tpName = score.training_program.name;
        const semester = score.semester;

        if (!grouped[tpId]) {
          grouped[tpId] = {
            trainingProgramName: tpName,
            semesters: {},
            noSemesterScores: [],
          };
        }

        if (semester) {
          if (!grouped[tpId].semesters[semester.id]) {
            grouped[tpId].semesters[semester.id] = {
              semesterName: semester.name,
              scores: [],
            };
          }
          grouped[tpId].semesters[semester.id].scores.push(score);
        } else {
          grouped[tpId].noSemesterScores.push(score);
        }
      });

      setGroupedScores(grouped);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu điểm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const openConfirmDelete = (score) => {
    setScoreToDelete(score);
    setIsConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setScoreToDelete(null);
    setIsConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!scoreToDelete) return;
    try {
      await scoreApi.deleteScore(scoreToDelete.id);
      addToast({
        title: "Thành công",
        message: "Điểm đã được xóa",
        type: "success",
        duration: 1500,
      });

      // Cập nhật lại state groupedScores, loại bỏ điểm vừa xóa khỏi nhóm
      setGroupedScores((prevGrouped) => {
        const newGrouped = { ...prevGrouped };

        // Lặp qua từng chương trình đào tạo
        for (const tpId in newGrouped) {
          const tpData = newGrouped[tpId];

          // Loại điểm không có học kỳ
          tpData.noSemesterScores = tpData.noSemesterScores.filter(
            (score) => score.id !== scoreToDelete.id
          );

          // Loại điểm có học kỳ
          for (const semId in tpData.semesters) {
            const semData = tpData.semesters[semId];
            semData.scores = semData.scores.filter(
              (score) => score.id !== scoreToDelete.id
            );
          }
        }
        return newGrouped;
      });
    } catch (error) {
      addToast({
        title: "Thất bại!",
        message: "Đã có lỗi xảy ra",
        type: "error",
        duration: 1500,
      });
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setScoreToDelete(null);
    }
  };
  const handleEditScore = (score) => {
    setScoreToEdit(score);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedScore) => {
    try {
      const res = await scoreApi.updateScore(updatedScore.id, updatedScore);
      const newScore = res.data.data; // giả sử API trả về điểm vừa cập nhật

      addToast({
        title: "Thành công",
        message: "Điểm đã được cập nhật",
        type: "success",
        duration: 1500,
      });

      setGroupedScores((prevGrouped) => {
        const newGrouped = {};

        for (const tpId in prevGrouped) {
          const tpData = prevGrouped[tpId];

          // map noSemesterScores: tìm score cũ để giữ các nested props
          newGrouped[tpId] = {
            trainingProgramName: tpData.trainingProgramName,
            noSemesterScores: tpData.noSemesterScores.map((score) => {
              if (score.id === newScore.id) {
                return { ...score, ...newScore }; // giữ user, course,..., cập nhật giá trị mới
              }
              return score;
            }),
            semesters: {},
          };

          for (const semId in tpData.semesters) {
            const semData = tpData.semesters[semId];
            newGrouped[tpId].semesters[semId] = {
              semesterName: semData.semesterName,
              scores: semData.scores.map((score) =>
                score.id === newScore.id ? { ...score, ...newScore } : score
              ),
            };
          }
        }

        return newGrouped;
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Lỗi",
        message: "Cập nhật điểm thất bại",
        type: "error",
        duration: 1500,
      });
    } finally {
      setIsEditModalOpen(false);
      setScoreToEdit(null);
    }
  };

  const toggleTP = (tpId) => {
    setOpenTP((prev) => ({
      ...prev,
      [tpId]: !prev[tpId],
    }));
  };

  // Hàm toggle collapse học kỳ
  const toggleSemester = (semId) => {
    setOpenSemester((prev) => ({
      ...prev,
      [semId]: !prev[semId],
    }));
  };

  if (loading)
    return (
      <Loading
        text="Đang tải dữ liệu..."
        size="lg"
        variant="primary"
        textVariant="primary"
      />
    );
  if (error) return <div className="text-center text-danger my-3">{error}</div>;

  return (
    <div className="container py-3">
      <h2 className="admin-scores__header ">Quản lý điểm học tập</h2>
      {Object.keys(groupedScores).length === 0 && <p>Chưa có điểm nào.</p>}

      {Object.entries(groupedScores).map(([tpId, tpData]) => (
        <Card
          key={tpId}
          className="mb-4 shadow-sm"
        >
          <Card.Header>
            <Button
              variant="link"
              onClick={() => toggleTP(tpId)}
              aria-controls={`tp-collapse-${tpId}`}
              aria-expanded={!!openTP[tpId]}
              className="text-decoration-none fw-bold fs-5"
            >
              {openTP[tpId] ? "▼" : "▶"} {tpData.trainingProgramName}
            </Button>
          </Card.Header>
          <Collapse in={!!openTP[tpId]}>
            <div id={`tp-collapse-${tpId}`}>
              <Card.Body>
                {tpData.noSemesterScores.length > 0 && (
                  <div className="mb-3">
                    <h5>Không có học kỳ</h5>
                    <ScoreTable
                      scores={tpData.noSemesterScores}
                      onDelete={openConfirmDelete}
                      onEdit={handleEditScore}
                    />
                  </div>
                )}

                {Object.entries(tpData.semesters).map(([semId, semData]) => (
                  <Card
                    key={semId}
                    className="mb-3 shadow-sm"
                  >
                    <Card.Header>
                      <Button
                        variant="link"
                        onClick={() => toggleSemester(semId)}
                        aria-controls={`sem-collapse-${semId}`}
                        aria-expanded={!!openSemester[semId]}
                        className="text-decoration-none fw-semibold"
                      >
                        {openSemester[semId] ? "▼" : "▶"} {semData.semesterName}
                      </Button>
                    </Card.Header>
                    <Collapse in={!!openSemester[semId]}>
                      <div id={`sem-collapse-${semId}`}>
                        <Card.Body>
                          <ScoreTable
                            scores={semData.scores}
                            onDelete={openConfirmDelete}
                            onEdit={handleEditScore}
                          />
                        </Card.Body>
                      </div>
                    </Collapse>
                  </Card>
                ))}
              </Card.Body>
            </div>
          </Collapse>
        </Card>
      ))}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Xác nhận xóa điểm"
        message={
          scoreToDelete
            ? `Bạn có chắc muốn xóa điểm của học viên ${scoreToDelete.user.name} môn ${scoreToDelete.course.title}?`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <EditScoreModal
        show={isEditModalOpen}
        score={scoreToEdit}
        onClose={() => {
          setIsEditModalOpen(false);
          setScoreToEdit(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

const ScoreTable = ({ scores, onDelete, onEdit }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const scoresPerPage = 1;

  const filteredScores = scores.filter((score) => {
    const searchLower = search.toLowerCase();

    const userText = `${score.user.name} ${score.user.email}`.toLowerCase();
    const courseCode = score.course.code.toLowerCase();
    const courseTitle = score.course.title.toLowerCase();

    return (
      userText.includes(searchLower) ||
      courseCode.includes(searchLower) ||
      courseTitle.includes(searchLower)
    );
  });

  const indexOfLast = currentPage * scoresPerPage;
  const indexOfFirst = indexOfLast - scoresPerPage;
  const currentScores = filteredScores.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredScores.length / scoresPerPage);
  const getVietnameseScoreType = (type) => {
    switch (type) {
      case "final":
        return "Cuối kỳ";
      case "midterm":
        return "Giữa kỳ";
      case "quiz":
        return "Kiểm tra";
      case "assignment":
        return "Bài tập";
      default:
        return type;
    }
  };
  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Tìm theo học viên, mã môn hoặc tên môn"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div>
          Trang {currentPage}/{totalPages || 1}
        </div>
      </div>

      <div className="admin-scores__table-wrapper">
        <table className="table table-bordered table-hover">
          <thead className="table-secondary">
            <tr>
              <th>Học viên</th>
              <th>Mã môn</th>
              <th>Tên môn</th>
              <th>Loại điểm</th>
              <th>Điểm</th>
              <th>Lần thi</th>
              <th>Đã duyệt</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentScores.length > 0 ? (
              currentScores.map((score) => (
                <tr key={score.id}>
                  <td>
                    <div className="fw-bold">{score.user.name}</div>
                    <div className="text-muted small">{score.user.email}</div>
                  </td>
                  <td>{score.course.code}</td>
                  <td>{score.course.title}</td>
                  <td>{getVietnameseScoreType(score.score_type)}</td>
                  <td>{score.value}</td>
                  <td>{score.attempt}</td>
                  <td className="text-center">
                    {score.is_accepted ? (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-success"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-danger"
                      />
                    )}
                  </td>
                  <td className="admin-scores__table-actions text-center d-flex justify-between">
                    <button
                      className="btn btn-sm btn-outline-primary m-auto"
                      onClick={() => onEdit(score)}
                      title="Sửa"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(score)}
                      title="Xoá"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center text-muted"
                >
                  Không tìm thấy học viên phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-end mt-2">
          <nav>
            <ul className="pagination pagination-sm mb-0">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminScores;
