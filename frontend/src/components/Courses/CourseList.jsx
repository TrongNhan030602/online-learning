import PropTypes from "prop-types";
import "../../styles/course/course-list.css";

const CourseList = ({ courses, onEdit, onDelete, onSelect }) => {
  return (
    <div className="course-list">
      <h2 className="course-list__title">Danh sách khóa học</h2>
      {courses && courses.length > 0 ? (
        <table className="course-list__table">
          <thead>
            <tr className="course-list__tr">
              <th className="course-list__th">ID</th>
              <th className="course-list__th">Tiêu đề</th>
              <th className="course-list__th">Mô tả</th>
              <th className="course-list__th">Giá</th>
              <th className="course-list__th">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
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
                <td className="course-list__td">{course.description}</td>
                <td className="course-list__td">{course.price}</td>
                <td className="course-list__td">
                  <button
                    className="course-list__action-button"
                    onClick={() => onEdit(course)}
                  >
                    Sửa
                  </button>
                  <button
                    className="course-list__action-button course-list__action-button--delete"
                    onClick={() => onDelete(course.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="course-list__no-data">Không có khóa học nào.</p>
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
};

export default CourseList;
