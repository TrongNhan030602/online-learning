/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faEye } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/useToast";

import { Collapse, Card, Button, Pagination } from "react-bootstrap";

import scoreApi from "@/api/scoreApi";
import learningResultApi from "@/api/learningResultApi";

import ConfirmDialog from "@/components/Common/ConfirmDialog";
import Loading from "@/components/common/Loading";
import EditScoreModal from "@/components/Scores/EditScoreModal";
import LearningResultModal from "@/components/LearningResult/LearningResultModal";

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
  const [loadingRecalculateOverall, setLoadingRecalculateOverall] = useState(
    {}
  );
  // State xem điểm tổng
  const [showLearningResultModal, setShowLearningResultModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState(null);

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
  const openLearningResultModal = (userId, programId) => {
    setSelectedUserId(userId);
    setSelectedProgramId(programId);
    setShowLearningResultModal(true);
  };

  const closeLearningResultModal = () => {
    setSelectedUserId(null);
    setSelectedProgramId(null);
    setShowLearningResultModal(false);
  };

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

  const recalculateOverall = async (programId) => {
    try {
      setLoadingRecalculateOverall((prev) => ({ ...prev, [programId]: true }));

      await learningResultApi.recalculateOverall(programId);

      addToast({
        title: "Thành công",
        message: `Đã lưu điểm tổng toàn chương trình.`,
        type: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: "Lỗi",
        message: "Lưu điểm tổng toàn chương trình thất bại",
        type: "error",
        duration: 2000,
      });
    } finally {
      setLoadingRecalculateOverall((prev) => ({ ...prev, [programId]: false }));
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
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Button
              variant="link"
              onClick={() => toggleTP(tpId)}
              aria-controls={`tp-collapse-${tpId}`}
              aria-expanded={!!openTP[tpId]}
              className="text-decoration-none fw-bold fs-5"
            >
              {openTP[tpId] ? "▼" : "▶"} {tpData.trainingProgramName}
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => recalculateOverall(tpId)}
              disabled={loadingRecalculateOverall[tpId]}
              className="me-2"
              title="Lưu kết quả và tính ĐTB, GPA toàn chương trình"
            >
              {loadingRecalculateOverall[tpId]
                ? "Đang cập nhật..."
                : "Lưu kết quả và tính ĐTB, GPA chương trình"}
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
                      programId={tpId}
                      onDelete={openConfirmDelete}
                      onEdit={handleEditScore}
                      onViewLearningResult={openLearningResultModal}
                    />
                  </div>
                )}

                {Object.entries(tpData.semesters).map(([semId, semData]) => (
                  <Card
                    key={semId}
                    className="mb-3 shadow-sm"
                  >
                    <Card.Header className="d-flex justify-content-between align-items-center">
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
                            programId={tpId}
                            onDelete={openConfirmDelete}
                            onEdit={handleEditScore}
                            onViewLearningResult={openLearningResultModal}
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
      <LearningResultModal
        show={showLearningResultModal}
        userId={selectedUserId}
        programId={selectedProgramId}
        onClose={closeLearningResultModal}
      />
    </div>
  );
};

const ScoreTable = ({
  scores,
  programId,
  onDelete,
  onEdit,
  onViewLearningResult,
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const scoresPerPage = 2;

  // Gom nhóm theo học viên
  const groupedByUser = {};
  scores.forEach((score) => {
    const userId = score.user.id;
    if (!groupedByUser[userId]) {
      groupedByUser[userId] = {
        user: score.user,
        courses: {},
      };
    }
    // gom điểm theo môn học trong user
    const courseId = score.course.id;
    if (!groupedByUser[userId].courses[courseId]) {
      groupedByUser[userId].courses[courseId] = {
        course: score.course,
        scoresByType: {},
      };
    }
    groupedByUser[userId].courses[courseId].scoresByType[score.score_type] =
      score;
  });

  // Chuyển sang mảng và lọc theo search (tìm theo học viên hoặc môn)
  const groupedArray = Object.values(groupedByUser).filter(
    ({ user, courses }) => {
      const userText = `${user.name} ${user.email}`.toLowerCase();
      const courseText = Object.values(courses)
        .map(({ course }) => `${course.code} ${course.title}`)
        .join(" ")
        .toLowerCase();

      const searchLower = search.toLowerCase();
      return userText.includes(searchLower) || courseText.includes(searchLower);
    }
  );

  const indexOfLast = currentPage * scoresPerPage;
  const indexOfFirst = indexOfLast - scoresPerPage;
  const currentUsers = groupedArray.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(groupedArray.length / scoresPerPage);
  const getPaginationRange = (total, current) => {
    const delta = 2; // số trang
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const scoreTypes = ["quiz", "midterm", "final"];
  const getLabel = (type) => {
    return {
      quiz: "Kiểm tra",
      midterm: "Giữa kỳ",
      final: "Cuối kỳ",
    }[type];
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo mssv hoặc email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mb-3">
              <Pagination>
                <Pagination.Prev
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
                {getPaginationRange(totalPages, currentPage).map((page, idx) =>
                  page === "..." ? (
                    <Pagination.Ellipsis
                      key={`ellipsis-${idx}`}
                      disabled
                    />
                  ) : (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Pagination.Item>
                  )
                )}

                <Pagination.Next
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <div className="admin-scores__table-wrapper">
        {currentUsers.length === 0 ? (
          <div>Không tìm thấy dữ liệu.</div>
        ) : (
          currentUsers.map(({ user, courses }) => (
            <div
              key={user.id}
              className="mb-4 p-3 border rounded shadow-sm"
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">{user.name}</h5>
                {onViewLearningResult && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onViewLearningResult(user.id, programId)}
                  >
                    <FontAwesomeIcon
                      icon={faEye}
                      className="me-2"
                    />
                    Xem kết quả học tập
                  </Button>
                )}
              </div>

              <div className="text-muted small mb-2">{user.email}</div>

              <table className="table table-bordered table-hover text-center align-middle">
                <thead className="table-secondary">
                  <tr>
                    <th>Mã môn</th>
                    <th>Tên môn</th>
                    {scoreTypes.map((type) => (
                      <th key={type}>{getLabel(type)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.values(courses).map(({ course, scoresByType }) => (
                    <tr key={course.id}>
                      <td>{course.code}</td>
                      <td className="text-start">{course.title}</td>
                      {scoreTypes.map((type) => {
                        const score = scoresByType[type];
                        return (
                          <td key={type}>
                            {score ? (
                              <div>
                                <div className="fw-bold">{score.value}</div>
                                <div className="d-flex justify-content-center gap-1 mt-1">
                                  <button
                                    className="btn btn-sm btn-outline-primary"
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
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AdminScores;
