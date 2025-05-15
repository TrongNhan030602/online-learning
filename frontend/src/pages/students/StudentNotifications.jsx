import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faClock,
  faBullhorn,
  faCalendarCheck,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import notificationApi from "@/api/notificationApi";
import "../../styles/student/student-notifications.css";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationApi.getAll();
        setNotifications(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông báo. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id); // Truyền notification_id
      setNotifications((prevNotifications) =>
        prevNotifications.map((noti) =>
          noti.notification_id === id
            ? { ...noti, is_read: true, read_at: new Date() }
            : noti
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "exam":
        return faCalendarCheck;
      case "announcement":
        return faBullhorn;
      case "reminder":
        return faInfoCircle;
      default:
        return faBell;
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case "exam":
        return "type-exam";
      case "announcement":
        return "type-announcement";
      case "reminder":
        return "type-reminder";
      default:
        return "type-default";
    }
  };

  // Tính số lượng thông báo chưa đọc
  const unreadCount = notifications.filter((noti) => !noti.is_read).length;

  if (loading) return <p className="text-center">Đang tải thông báo...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="student-notifications">
      <h1 className="student-notifications__title">
        <FontAwesomeIcon
          icon={faBell}
          className="me-2 text-primary"
        />
        Thông báo
        {unreadCount > 0 && (
          <span className="student-notifications__badge">{unreadCount}</span>
        )}
      </h1>
      <ul className="student-notifications__list">
        {notifications.map((noti) => (
          <li
            key={noti.id}
            className={`student-notifications__item ${
              !noti.is_read ? "student-notifications__item--new" : ""
            } ${getTypeClass(noti.notification.type)}`}
            onClick={() => handleMarkAsRead(noti.notification_id)} // Truyền notification_id
          >
            <div className="student-notifications__item-header">
              <h2 className="student-notifications__item-title">
                <FontAwesomeIcon
                  icon={getTypeIcon(noti.notification.type)}
                  className="me-2"
                />
                {noti.notification.title}
              </h2>
              <span className="student-notifications__item-time">
                <FontAwesomeIcon
                  icon={faClock}
                  className="me-1"
                />
                {new Date(noti.notification.created_at).toLocaleDateString(
                  "vi-VN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
            <p className="student-notifications__item-content">
              {noti.notification.body}
            </p>
            {/* Hiển thị thông tin chương trình đào tạo */}
            <p className="student-notifications__item-program">
              Chương trình: {noti.notification.training_program.code} -{" "}
              {noti.notification.training_program.name}
            </p>
            <p className="student-notifications__read-status">
              {noti.is_read ? "Đã đọc" : "Chưa đọc"}
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
