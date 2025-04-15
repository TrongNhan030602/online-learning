import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSort } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "../../styles/classes/class-list.css";

// Hàm chuyển trạng thái sang văn bản
const getStatusText = (status) => {
  switch (status) {
    case "open":
      return "Đang mở";
    case "ongoing":
      return "Đang diễn ra";
    case "completed":
      return "Hoàn thành";
    case "closed":
      return "Đã đóng";
    default:
      return "Không xác định";
  }
};

const ClassList = ({ classes, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("");

  // Lọc danh sách theo trạng thái
  const filteredClasses = classes.filter((classItem) => {
    return !statusFilter || classItem.status === statusFilter;
  });

  // Sắp xếp danh sách
  const sortedClasses = [...filteredClasses].sort((a, b) => {
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
    <div className="class-list">
      <h2 className="class-list__title">Danh sách lớp học</h2>

      {/* Bộ lọc trạng thái */}
      <div className="class-list__filters">
        <select
          className="class-list__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="open">Đang mở</option>
          <option value="ongoing">Đang diễn ra</option>
          <option value="completed">Hoàn thành</option>
          <option value="closed">Đã đóng</option>
        </select>
      </div>

      {/* Bảng danh sách lớp học */}
      <div className="class-list__table-wrapper">
        <table className="class-list__table">
          <thead>
            <tr className="class-list__tr">
              <th
                className="class-list__td"
                onClick={() => handleSort("id")}
              >
                ID <FontAwesomeIcon icon={faSort} />
              </th>
              <th
                className="class-list__td"
                onClick={() => handleSort("name")}
              >
                Tên lớp <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="class-list__td">Khóa học</th>
              <th className="class-list__td">Trạng thái</th>
              <th className="class-list__td">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedClasses.length > 0 ? (
              sortedClasses.map((classItem) => (
                <tr key={classItem.id}>
                  <td className="class-list__td">{classItem.id}</td>
                  <td className="class-list__td">
                    <Link
                      className="class-list__link"
                      to={`/admin/classes/${classItem.id}`}
                    >
                      {classItem.name}
                    </Link>
                  </td>
                  <td className="class-list__td">{classItem.course.title}</td>
                  <td className="class-list__td">
                    {getStatusText(classItem.status)}
                  </td>
                  <td className="class-list__td">
                    <button
                      onClick={() => onEdit(classItem)}
                      title="Sửa lớp học"
                      className="class-list__action-button"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(classItem.id)}
                      title="Xóa lớp học"
                      className="class-list__action-button class-list__action-button--delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="class-list__tr">
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  {statusFilter
                    ? "Không tìm thấy lớp học nào phù hợp với bộ lọc."
                    : "Chưa có lớp học nào được tạo."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ClassList.propTypes = {
  classes: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ClassList;
