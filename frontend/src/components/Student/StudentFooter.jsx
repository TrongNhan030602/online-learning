import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "../../styles/student/student-footer.css";

const StudentFooter = () => {
  return (
    <footer className="student-footer">
      <div className="student-footer__content">
        <p className="student-footer__text">
          © 2025 eLearning. All Rights Reserved.
        </p>
        <ul className="student-footer__links">
          <li className="student-footer__link-item">
            <a href="#">Chính sách bảo mật</a>
          </li>
          <li className="student-footer__link-item">
            <a href="#">Điều khoản sử dụng</a>
          </li>
        </ul>
        <div className="student-footer__contact">
          <FontAwesomeIcon
            icon={faPhone}
            className="student-footer__icon"
          />
          <FontAwesomeIcon
            icon={faEnvelope}
            className="student-footer__icon"
          />
        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;
