// TrainingCollegePage.jsx
import { Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faBookOpen,
  faGlobe,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/landing/training-page/training-detail-college.css";
import collegeImg from "../../assets/img/landing/cao-dang-trung-cap.png";

const TrainingCollegePage = () => {
  return (
    <div className="training-college">
      <Row className="align-items-start mb-4">
        <Col md={12}>
          <h1 className="training-college__title">
            <FontAwesomeIcon
              icon={faGraduationCap}
              className="me-2"
            />
            Thiết kế đồ họa & Truyền thông đa phương tiện
          </h1>
          <p className="training-college__desc">
            Chương trình đào tạo chính quy từ 2-3 năm, trang bị nền tảng vững
            chắc để trở thành cử nhân/kỹ sư chuyên nghiệp.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col
          md={8}
          className="text-center"
        >
          <img
            src={collegeImg}
            alt="Lộ trình học"
            className="training-college__banner-image"
          />
          <div className="training-college__banner-caption">
            Lộ trình học thiết kế chuyên sâu & thực chiến
          </div>
        </Col>
      </Row>

      <Row className="training-college__cards">
        <Col
          md={4}
          className="mb-4"
        >
          <Card className="training-college__card h-100">
            <Card.Body>
              <FontAwesomeIcon
                icon={faBookOpen}
                size="2x"
              />
              <h5>Kiến thức thực tiễn</h5>
              <p>
                Chương trình tích hợp lý thuyết và thực hành, sát thực tế doanh
                nghiệp.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col
          md={4}
          className="mb-4"
        >
          <Card className="training-college__card h-100">
            <Card.Body>
              <FontAwesomeIcon
                icon={faGlobe}
                size="2x"
              />
              <h5>Liên thông</h5>
              <p>Mở rộng cơ hội học tập.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col
          md={4}
          className="mb-4"
        >
          <Card className="training-college__card h-100">
            <Card.Body>
              <FontAwesomeIcon
                icon={faChalkboardTeacher}
                size="2x"
              />
              <h5>Giảng viên chuyên nghiệp</h5>
              <p>Đội ngũ giàu kinh nghiệm thực chiến, giảng dạy tận tâm.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrainingCollegePage;
