import "../../styles/student/student-notifications.css";

const StudentNotifications = () => {
  return (
    <div className="student-notifications">
      <h1 className="student-notifications__title">Thông báo</h1>
      <ul className="student-notifications__list">
        <li className="student-notifications__item">
          <h2 className="student-notifications__item-title">Thông báo 1</h2>
          <p className="student-notifications__item-content">
            Chi tiết thông báo 1.
          </p>
        </li>
        <li className="student-notifications__item student-notifications__item-new">
          <h2 className="student-notifications__item-title">Thông báo 2</h2>
          <p className="student-notifications__item-content">
            Chi tiết thông báo 2.
          </p>
        </li>
        <li className="student-notifications__item">
          <h2 className="student-notifications__item-title">Thông báo 3</h2>
          <p className="student-notifications__item-content">
            Chi tiết thông báo 3.
          </p>
        </li>
      </ul>
      <p className="student-notifications__message">
        Bạn có thể nhận thêm thông báo mới từ hệ thống.
      </p>
    </div>
  );
};

export default StudentNotifications;
