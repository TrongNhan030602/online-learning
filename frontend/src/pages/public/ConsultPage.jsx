import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faRoute,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import ConsultForm from "@/components/Landing/Consult/ConsultForm";
import "../../styles/landing/consult/consult-page.css";

const ConsultPage = () => {
  return (
    <section className="consult-page">
      <Container>
        <Row className="align-items-center">
          <Col
            md={6}
            className="consult-page__text"
          >
            <h2 className="consult-page__title">Đăng ký tư vấn miễn phí</h2>
            <p className="consult-page__description">
              Bạn đang phân vân chưa biết chọn khóa học nào? Hãy để chúng tôi
              giúp bạn định hướng lộ trình học phù hợp với nhu cầu và mục tiêu
              của bạn.
            </p>
            <ul className="consult-page__benefits">
              <li className="consult-page__benefits-item">
                <FontAwesomeIcon
                  icon={faChalkboardTeacher}
                  className="consult-page__icon"
                />
                Được tư vấn trực tiếp từ chuyên gia
              </li>
              <li className="consult-page__benefits-item">
                <FontAwesomeIcon
                  icon={faRoute}
                  className="consult-page__icon"
                />
                Định hướng lộ trình học chi tiết
              </li>
              <li className="consult-page__benefits-item">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="consult-page__icon"
                />
                Nhận tài liệu học thử miễn phí
              </li>
            </ul>
          </Col>
          <Col md={6}>
            <ConsultForm />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ConsultPage;
