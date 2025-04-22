import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

const Slogan = () => (
  <div className="dashboard__slogan">
    <h2 className="dashboard__slogan-title">
      <FontAwesomeIcon
        icon={faLightbulb}
        className="me-2 text-primary"
      />
      Học hôm nay - Làm chủ ngày mai
    </h2>
    <p className="dashboard__slogan-subtext">
      Mở rộng tư duy, nâng cao kỹ năng với những khóa học chất lượng.
    </p>
  </div>
);

export default Slogan;
