import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faBell,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/student/student-dashboard.css";

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <h1>Tổng quan</h1>
      <div className="dashboard__widgets">
        <div className="widget">
          <FontAwesomeIcon icon={faGraduationCap} />
          <h3>Khóa học đang học</h3>
          <p>Thông tin về các khóa học hiện tại.</p>
        </div>
        <div className="widget">
          <FontAwesomeIcon icon={faTasks} />
          <h3>Tiến độ học tập</h3>
          <p>Tiến độ của các khóa học và bài học.</p>
        </div>
        <div className="widget">
          <FontAwesomeIcon icon={faBell} />
          <h3>Thông báo</h3>
          <p>Cập nhật thông báo mới từ giảng viên và hệ thống.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
