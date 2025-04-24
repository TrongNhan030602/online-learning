import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools } from "@fortawesome/free-solid-svg-icons";
import intermediateImg1 from "../../assets/img/landing/cao-dang-trung-cap.png";
import "../../styles/landing/training-page/training-detail-intermediate.css";

const TrainingIntermediatePage = () => {
  return (
    <div className="intermediate">
      <Row className="mb-4">
        <Col>
          <h1 className="intermediate__title">
            <FontAwesomeIcon
              icon={faTools}
              className="me-2"
            />
            Chương Trình Trung Cấp
          </h1>
          <p className="intermediate__desc">
            Chương trình đào tạo nghề thực hành, giúp học viên làm chủ kỹ năng
            và sớm gia nhập thị trường lao động.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <ul className="intermediate__list">
            <li>Thời gian học ngắn hơn</li>
            <li>Tập trung thực hành và kỹ năng</li>
            <li>Dễ dàng tìm kiếm việc làm</li>
          </ul>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <div className="intermediate__image-wrapper">
            <img
              src={intermediateImg1}
              alt="Chương trình đào tạo Trung Cấp"
              className="intermediate__image"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TrainingIntermediatePage;
