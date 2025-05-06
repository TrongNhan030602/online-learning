import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const RegisteredClasses = () => {
  const classes = [
    { id: 1, name: "Thiết kế Đồ Họa", date: "15/05/2025" },
    { id: 2, name: "Lập trình Web", date: "20/05/2025" },
  ];

  return (
    <div className="registered-classes">
      <h3 className="registered-classes__title">
        <FontAwesomeIcon
          icon={faCalendarAlt}
          className="registered-classes__icon"
        />
        Lớp học đã đăng ký
      </h3>
      <ul className="registered-classes__list">
        {classes.map((classItem) => (
          <li
            key={classItem.id}
            className="registered-classes__item"
          >
            <p className="registered-classes__class-name">{classItem.name}</p>
            <span className="registered-classes__class-date">
              Ngày: {classItem.date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisteredClasses;
