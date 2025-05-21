import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowUp,
  faArrowDown,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import DisciplineScoreModal from "./DisciplineScoreModal";
import "../../styles/discipline-scores/discipline-score-list.css";

const DisciplineScoreList = ({ scores, onDelete, onUpdate }) => {
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleUpdate = (updatedItem) => {
    onUpdate(updatedItem);
    setModalOpen(false);
  };

  // Nhóm điểm theo học viên và chương trình đào tạo
  const groupedScores = [];
  scores.forEach((item) => {
    const key = `${item.student_name}-${item.training_program?.name}`;
    const existingGroup = groupedScores.find((group) => group.key === key);

    if (existingGroup) {
      existingGroup.scores.push(item);
    } else {
      groupedScores.push({
        key,
        student_name: item.student_name,
        training_program_name: item.training_program?.name,
        scores: [item],
      });
    }
  });

  // Sắp xếp học kỳ theo số
  const getSortValue = (item) => {
    if (sortKey === "semester_name") {
      const match = item.semester_name.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return item[sortKey];
  };

  const sortedScores = groupedScores.map((group) => ({
    ...group,
    scores: group.scores.sort((a, b) => {
      const aVal = getSortValue(a);
      const bVal = getSortValue(b);
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }),
  }));

  const filteredScores = sortedScores.filter(
    (group) =>
      group.student_name.toLowerCase().includes(filter.toLowerCase()) ||
      group.training_program_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="discipline-score-list">
      {/* Nút quay lại */}
      <button
        onClick={() => window.history.back()}
        className="back-button"
      >
        ← Quay lại
      </button>

      <div className="discipline-score-list__filters">
        <input
          type="text"
          placeholder="Tìm theo Tên học viên & chương trình"
          value={filter}
          onChange={handleFilter}
          className="discipline-score-list__filter"
        />
      </div>

      <table className="discipline-score-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              ID
              <FontAwesomeIcon
                icon={
                  sortKey === "id"
                    ? sortOrder === "asc"
                      ? faArrowUp
                      : faArrowDown
                    : faArrowUp
                }
                className="sort-icon"
              />
            </th>
            <th>Học viên</th>
            <th>Chương trình đào tạo</th>
            <th onClick={() => handleSort("semester_name")}>
              Học kỳ
              <FontAwesomeIcon
                icon={
                  sortKey === "semester_name"
                    ? sortOrder === "asc"
                      ? faArrowUp
                      : faArrowDown
                    : faArrowUp
                }
                className="sort-icon"
              />
            </th>
            <th onClick={() => handleSort("score")}>
              Điểm
              <FontAwesomeIcon
                icon={
                  sortKey === "score"
                    ? sortOrder === "asc"
                      ? faArrowUp
                      : faArrowDown
                    : faArrowUp
                }
                className="sort-icon"
              />
            </th>
            <th>Đánh giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredScores.length > 0 ? (
            filteredScores.map((group) =>
              group.scores.map((item, index) => (
                <tr key={item.id}>
                  {index === 0 && (
                    <>
                      <td rowSpan={group.scores.length}>{item.id}</td>
                      <td rowSpan={group.scores.length}>
                        {group.student_name}
                      </td>
                      <td rowSpan={group.scores.length}>
                        {group.training_program_name}
                      </td>
                    </>
                  )}
                  <td>{item.semester_name}</td>
                  <td>{item.score}</td>
                  <td>{item.evaluation}</td>
                  <td>
                    <button
                      onClick={() => onDelete(item.id)}
                      title="Xóa điểm rèn luyện"
                      className="discipline-score__btn--delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      onClick={() => handleUpdateClick(item)}
                      title="Cập nhật điểm rèn luyện"
                      className="discipline-score__btn--edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td
                colSpan="7"
                style={{ textAlign: "center" }}
              >
                Không có dữ liệu điểm rèn luyện.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <DisciplineScoreModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        item={selectedItem}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

DisciplineScoreList.propTypes = {
  scores: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default DisciplineScoreList;
