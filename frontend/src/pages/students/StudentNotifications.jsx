import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faClock } from "@fortawesome/free-solid-svg-icons";
import "../../styles/student/student-notifications.css";

const notifications = [
  {
    id: 1,
    title: "Thông báo lịch thi giữa kỳ",
    content: "Sinh viên kiểm tra lịch thi giữa kỳ tại mục 'Lịch thi'.",
    isNew: false,
    time: "10/04/2025",
  },
  {
    id: 2,
    title: "Thông báo học bổng học kỳ 2",
    content: "Sinh viên đạt thành tích tốt có thể nộp hồ sơ xin học bổng.",
    isNew: true,
    time: "22/04/2025",
  },
  {
    id: 3,
    title: "Thông báo nghỉ lễ 30/4 - 1/5",
    content: "Sinh viên được nghỉ lễ từ 29/4 đến hết ngày 2/5.",
    isNew: false,
    time: "18/04/2025",
  },
];

const StudentNotifications = () => {
  return (
    <div className="student-notifications">
      <h1 className="student-notifications__title">
        <FontAwesomeIcon
          icon={faBell}
          className="me-2 text-primary"
        />
        Thông báo
      </h1>
      <ul className="student-notifications__list">
        {notifications.map((noti) => (
          <li
            key={noti.id}
            className={`student-notifications__item ${
              noti.isNew ? "student-notifications__item--new" : ""
            }`}
          >
            <div className="student-notifications__item-header">
              <h2 className="student-notifications__item-title">
                {noti.title}
              </h2>
              <span className="student-notifications__item-time">
                <FontAwesomeIcon
                  icon={faClock}
                  className="me-1"
                />
                {noti.time}
              </span>
            </div>
            <p className="student-notifications__item-content">
              {noti.content}
            </p>
          </li>
        ))}
      </ul>
      <p className="student-notifications__message">
        Bạn có thể nhận thêm thông báo mới từ hệ thống bất cứ lúc nào.
      </p>
    </div>
  );
};

export default StudentNotifications;
