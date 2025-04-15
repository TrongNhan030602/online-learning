import "../../styles/landing/call-to-action.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const CallToAction = ({ onLoginClick }) => {
  return (
    <section className="cta">
      <div className="cta__overlay" />
      <div className="cta__content">
        <h2 className="cta__title">Sẵn sàng bắt đầu hành trình học tập?</h2>
        <p className="cta__subtitle">
          Tham gia ngay vào hệ thống E-Learning Design24 – nơi giúp bạn học tập
          bài bản và thực chiến!
        </p>
        <button
          className="cta__button"
          onClick={onLoginClick}
        >
          Đăng nhập để học ngay <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </section>
  );
};
CallToAction.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
};

export default CallToAction;
