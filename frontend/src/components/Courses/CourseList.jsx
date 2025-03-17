import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faEdit,
  faTrash,
  faFolderOpen,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
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

const CourseList = ({ courses, onEdit, onDelete, onSelect, onManageFiles }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="course-list">
      <h2 className="course-list__title">Danh sách khóa học</h2>
      <input
        type="text"
        className="course-list__search"
        placeholder="Tìm kiếm khóa học..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredCourses.length === 0 ? (
        <p className="course-list__no-data">Không tìm khóa học phù hợp.</p>
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
                  onClick={() => handleSort("title")}
                >
                  Tiêu đề <FontAwesomeIcon icon={faSort} />
                </th>
                <th className="course-list__th">Mô tả</th>
                <th
                  className="course-list__th"
                  onClick={() => handleSort("price")}
                >
                  Giá <FontAwesomeIcon icon={faSort} />
                </th>
                <th className="course-list__th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedCourses.map((course) => (
                <tr
                  key={course.id}
                  className="course-list__tr"
                >
                  <td className="course-list__td">{course.id}</td>
                  <td className="course-list__td">
                    <a
                      href="#!"
                      className="course-list__link"
                      onClick={(e) => {
                        e.preventDefault();
                        onSelect(course);
                      }}
                    >
                      {course.title}
                    </a>
                  </td>
                  <td className="course-list__td">
                    <ExpandableText text={course.description} />
                  </td>
                  <td className="course-list__td">{course.price}</td>
                  <td className="course-list__td">
                    <button
                      className="course-list__action-button"
                      onClick={() => onEdit(course)}
                      title="Sửa khóa học"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="course-list__action-button course-list__action-button--delete"
                      onClick={() => onDelete(course.id)}
                      title="Xóa khóa học"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className="course-list__action-button"
                      onClick={() => onManageFiles(course)}
                      title="Quản lý file"
                    >
                      <FontAwesomeIcon icon={faFolderOpen} />
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
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onManageFiles: PropTypes.func.isRequired,
};

export default CourseList;
