import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSort } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles/trainingPrograms/training-program-list.css";

const TrainingProgramList = ({ trainingPrograms, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  // Sắp xếp danh sách
  const sortedPrograms = [...trainingPrograms].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Xử lý khi nhấn vào tiêu đề cột để sắp xếp
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="training-program-list">
      <h2 className="training-program-list__title">
        Danh sách chương trình đào tạo
      </h2>

      {/* Bảng danh sách chương trình đào tạo */}
      <div className="training-program-list__table-wrapper">
        <table className="training-program-list__table">
          <thead>
            <tr className="training-program-list__tr">
              <th
                className="training-program-list__td"
                onClick={() => handleSort("id")}
              >
                ID <FontAwesomeIcon icon={faSort} />
              </th>
              <th
                className="training-program-list__td"
                onClick={() => handleSort("name")}
              >
                Tên chương trình <FontAwesomeIcon icon={faSort} />
              </th>
              <th
                className="training-program-list__td"
                onClick={() => handleSort("course_id")}
              >
                Khóa học ID <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="training-program-list__td">Mô tả</th>
              <th className="training-program-list__td">Thời gian</th>
              <th className="training-program-list__td">Yêu cầu</th>
              <th className="training-program-list__td">Mục tiêu</th>
              <th className="training-program-list__td">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedPrograms.length > 0 ? (
              sortedPrograms.map((program) => (
                <tr key={program.id}>
                  <td className="training-program-list__td">{program.id}</td>
                  <td className="training-program-list__td">
                    <Link
                      className="training-program-list__link"
                      to={`/admin/training-programs/${program.id}`}
                    >
                      {program.name}
                    </Link>
                  </td>
                  <td className="training-program-list__td">
                    {program.course_id}
                  </td>
                  <td className="training-program-list__td">
                    {program.description}
                  </td>
                  <td className="training-program-list__td">
                    {program.duration} tháng
                  </td>
                  <td className="training-program-list__td">
                    {program.requirements}
                  </td>
                  <td className="training-program-list__td">
                    {program.objectives}
                  </td>
                  <td className="training-program-list__td">
                    <button
                      onClick={() => onEdit(program)}
                      title="Sửa chương trình đào tạo"
                      className="training-program-list__action-button"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(program.id)}
                      title="Xóa chương trình đào tạo"
                      className="training-program-list__action-button training-program-list__action-button--delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="training-program-list__tr">
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  Chưa có chương trình đào tạo nào được tạo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TrainingProgramList.propTypes = {
  trainingPrograms: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TrainingProgramList;
