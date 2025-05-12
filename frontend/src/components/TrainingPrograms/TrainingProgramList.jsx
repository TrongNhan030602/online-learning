import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSort,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles/trainingPrograms/training-program-list.css";

const TrainingProgramList = ({ trainingPrograms, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const levelPriority = {
    college: 1,
    intermediate: 2,
    certificate: 3,
    specialized: 4,
    software: 5,
  };

  const sortedPrograms = [...trainingPrograms].sort((a, b) => {
    const aVal =
      sortConfig.key === "level" ? levelPriority[a.level] : a[sortConfig.key];
    const bVal =
      sortConfig.key === "level" ? levelPriority[b.level] : b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };
  const formatLevel = (level) => {
    switch (level) {
      case "college":
        return "Cao đẳng";
      case "intermediate":
        return "Trung cấp";
      case "certificate":
        return "Chứng chỉ nghề";
      case "specialized":
        return "Chuyên sâu";
      case "software":
        return "Phần mềm";
      default:
        return level;
    }
  };
  const getLevelDescription = (level) => {
    switch (level) {
      case "college":
        return "Chương trình có nhiều môn học, cấp bằng tốt nghiệp, có thể liên thông.";
      case "intermediate":
        return "Chương trình trung cấp, có học kỳ, cấp bằng tốt nghiệp,có thể liên thông.";
      case "certificate":
        return "Chứng chỉ nghề, phải học đủ các môn";
      case "specialized":
        return "Chứng nhận chuyên đề cụ thể, học nhiều môn, không chia học kỳ.";
      case "software":
        return "Chỉ học một phần mềm duy nhất, ví dụ: Photoshop.";
      default:
        return "";
    }
  };

  return (
    <div className="training-program-list">
      <h2 className="training-program-list__title">
        Danh sách chương trình đào tạo
      </h2>
      <div className="training-program-list__table-wrapper">
        <table className="training-program-list__table">
          <thead>
            <tr className="training-program-list__tr">
              <th
                className="training-program-list__td"
                onClick={() => handleSort("id")}
              >
                <span className="sortable-header">
                  ID <FontAwesomeIcon icon={faSort} />
                </span>
              </th>
              <th
                className="training-program-list__td"
                onClick={() => handleSort("name")}
              >
                <span className="sortable-header">
                  Tên <FontAwesomeIcon icon={faSort} />
                </span>
              </th>
              <th
                className="training-program-list__td"
                onClick={() => handleSort("code")}
              >
                <span className="sortable-header">
                  Mã Lớp <FontAwesomeIcon icon={faSort} />
                </span>
              </th>

              <th
                className="training-program-list__td"
                onClick={() => handleSort("level")}
              >
                <span className="sortable-header">
                  Cấp bậc <FontAwesomeIcon icon={faSort} />
                </span>
              </th>
              <th className="training-program-list__td">Cố vấn</th>
              <th className="training-program-list__td">Số học kỳ</th>
              <th className="training-program-list__td">Ghi chú</th>
              <th className="training-program-list__td">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedPrograms.length > 0 ? (
              sortedPrograms.map((program, index) =>
                program.id ? ( // Kiểm tra id của mỗi chương trình
                  <tr key={program.id}>
                    <td className="training-program-list__td">{program.id}</td>
                    <td className="training-program-list__td">
                      <Link
                        to={`/admin/training-programs/${program.id}`}
                        className="training-program-list__link"
                      >
                        {program.name}
                      </Link>
                    </td>
                    <td className="training-program-list__td">
                      {program.code}
                    </td>
                    <td
                      className="training-program-list__td"
                      title={getLevelDescription(program.level)}
                    >
                      {formatLevel(program.level)}
                    </td>

                    <td className="training-program-list__td">
                      {program.advisor?.name || "—"}
                    </td>
                    <td className="training-program-list__td">
                      {program.semesters?.length || 0}
                    </td>

                    <td className="training-program-list__td">
                      {program.note}
                    </td>
                    <td className="training-program-list__td">
                      <button
                        onClick={() => onEdit(program)}
                        title="Sửa chương trình đào tạo"
                        className="training-program-list__action-button"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {(program.level === "college" ||
                        program.level === "intermediate") && (
                        <Link
                          to={`/admin/training-programs/${program.id}/discipline-scores`}
                          title="Nhập điểm rèn luyện"
                          className="training-program-list__action-button  training-program-list__action-button--enter"
                        >
                          <FontAwesomeIcon icon={faClipboardList} />
                        </Link>
                      )}
                      <button
                        onClick={() => onDelete(program.id)}
                        title="Xóa chương trình đào tạo"
                        className="training-program-list__action-button training-program-list__action-button--delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={index}>
                    {" "}
                    {/* Nếu không có id, không render dòng này */}
                    <td
                      colSpan="9"
                      style={{ textAlign: "center", padding: "10px" }}
                    >
                      Dữ liệu không hợp lệ.
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr className="training-program-list__tr">
                <td
                  colSpan="9"
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
