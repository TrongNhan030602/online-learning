import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons"; // Import icon

const Slogan = () => {
  return (
    <div className="slogan text-center py-5 bg-light rounded shadow">
      <h2 className="slogan__title display-4 text-primary mb-3">
        <FontAwesomeIcon
          icon={faGraduationCap}
          className="slogan__icon mr-2"
        />
        Chào mừng bạn đến với Hệ thống Học Tập!
      </h2>
      <p className="slogan__description lead text-muted">
        Khám phá chương trình học, khóa học mới và nhiều hơn nữa!
      </p>
    </div>
  );
};

export default Slogan;
