import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

const NewCourses = () => {
  const newCourses = [
    {
      id: 1,
      name: "Khóa học Python cơ bản",
      description: "Lập trình Python từ cơ bản đến nâng cao.",
    },
    {
      id: 2,
      name: "Thiết kế Web cơ bản",
      description: "Học cách xây dựng website chuyên nghiệp.",
    },
  ];

  return (
    <div className="new-courses">
      <h3 className="new-courses__title">
        <FontAwesomeIcon
          icon={faBookOpen}
          className="new-courses__icon"
        />
        Khóa học mới
      </h3>
      <ul className="new-courses__list">
        {newCourses.map((course) => (
          <li
            key={course.id}
            className="new-courses__item"
          >
            <h4 className="new-courses__item-title">{course.name}</h4>
            <p className="new-courses__item-description">
              {course.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewCourses;
