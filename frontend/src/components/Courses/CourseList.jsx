import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faEdit,
  faTrash,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // import useNavigate from react-router-dom
import "../../styles/course/course-list.css";

const ExpandableText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((prev) => !prev);

  if (!text) return null;

  return (
    <div className="expandable-text">
      <p
        className={
          expanded
            ? "expandable-text__para"
            : "expandable-text__para expandable-text__para--clamped"
        }
      >
        {text}
      </p>
      {text.length > 100 && (
        <button
          className="expandable-text__toggle"
          onClick={toggleExpanded}
        >
          {expanded ? (
            <>
              <FontAwesomeIcon icon={faChevronUp} /> Thu gọn
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faChevronDown} /> Xem thêm
            </>
          )}
        </button>
      )}
    </div>
  );
};

ExpandableText.propTypes = {
  text: PropTypes.string.isRequired,
};

const CourseList = ({ subjects, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate(); // Khởi tạo useNavigate hook

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Hàm xử lý khi người dùng click vào môn học để chuyển trang chi tiết
  const handleCourseClick = (id) => {
    navigate(`/admin/courses/${id}`); // Chuyển đến trang chi tiết môn học
  };

  return (
    <div className="course-list">
      <h2 className="course-list__title">Danh sách Môn học</h2>
      <input
        type="text"
        className="course-list__search"
        placeholder="Tìm kiếm theo mã hoặc tên môn học..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredSubjects.length === 0 ? (
        <p className="course-list__no-data">Không tìm thấy môn học phù hợp.</p>
      ) : (
        <div className="course-list__table-wrapper">
          <table className="course-list__table">
            <thead>
              <tr className="course-list__tr">
                <th
                  className="course-list__th"
                  onClick={() => handleSort("id")}
                >
                  ID <FontAwesomeIcon icon={faSort} />
                </th>
                <th
                  className="course-list__th"
                  onClick={() => handleSort("code")}
                >
                  Mã môn <FontAwesomeIcon icon={faSort} />
                </th>
                <th
                  className="course-list__th"
                  onClick={() => handleSort("title")}
                >
                  Tên môn <FontAwesomeIcon icon={faSort} />
                </th>
                <th className="course-list__th">Mô tả</th>
                <th
                  className="course-list__th"
                  onClick={() => handleSort("credits")}
                >
                  Tín chỉ <FontAwesomeIcon icon={faSort} />
                </th>
                <th className="course-list__th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedSubjects.map((subject) => (
                <tr
                  key={subject.id}
                  className="course-list__tr"
                >
                  <td
                    className="course-list__td"
                    onClick={() => handleCourseClick(subject.id)}
                  >
                    {subject.id}
                  </td>
                  <td
                    className="course-list__td"
                    onClick={() => handleCourseClick(subject.id)}
                  >
                    {subject.code}
                  </td>
                  <td
                    className="course-list__td course-list__td-title"
                    onClick={() => handleCourseClick(subject.id)}
                  >
                    {subject.title}
                  </td>
                  <td className="course-list__td">
                    <ExpandableText text={subject.description} />
                  </td>
                  <td className="course-list__td">{subject.credits}</td>
                  <td className="course-list__td">
                    <button
                      className="course-list__action-button"
                      onClick={() => onEdit(subject)}
                      title="Sửa môn học"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="course-list__action-button course-list__action-button--delete"
                      onClick={() => onDelete(subject.id)}
                      title="Xóa môn học"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

CourseList.propTypes = {
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      credits: PropTypes.number.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CourseList;
