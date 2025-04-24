import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate } from "@fortawesome/free-solid-svg-icons";
import "../../styles/landing/training-page/training-detail-certificate.css";

import certificate1 from "../../assets/img/landing/chung-chi-1.png";
import certificate2 from "../../assets/img/landing/chung-chi-2.png";

const TrainingCertificatePage = () => {
  return (
    <div className="certificate">
      <Row className="mb-4">
        <Col>
          <h1 className="certificate__title">
            <FontAwesomeIcon
              icon={faCertificate}
              className="me-2"
            />
            Chương Trình Chứng Chỉ
          </h1>
          <p className="certificate__desc">
            Chương trình đào tạo chuyên sâu, giúp học viên đạt được chứng chỉ
            chứng nhận kỹ năng cần thiết để bước vào thị trường lao động.
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <ul className="certificate__list">
            <li>Khóa học được công nhận bởi các tổ chức quốc tế</li>
            <li>Cấp chứng chỉ hoàn thành khóa học sau khi tốt nghiệp</li>
            <li>Chương trình đào tạo linh hoạt, phù hợp cho mọi đối tượng</li>
          </ul>
        </Col>
      </Row>

      {/* Bỏ Row + Col ở phần ảnh, để ảnh nằm giữa đẹp hơn */}
      <div className="certificate__images mt-4">
        <div className="certificate__image-wrapper">
          <img
            src={certificate1}
            alt="Chứng chỉ 1"
            className="certificate__image"
          />
        </div>
        <div className="certificate__image-wrapper">
          <img
            src={certificate2}
            alt="Chứng chỉ 2"
            className="certificate__image"
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingCertificatePage;
