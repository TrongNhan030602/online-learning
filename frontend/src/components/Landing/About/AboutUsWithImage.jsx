import { Container, Row, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import aboutImage from "../../../assets/img/landing/about/about-us.jpg";
import "../../../styles/landing/about/about-page.css";

const AboutUsWithImage = () => {
  return (
    <section className="about-us-with-image">
      <Container>
        <Row className="align-items-center">
          {/* Ảnh + box thống kê */}
          <Col
            xs={12}
            md={6}
            className="about-us-with-image__image mb-4 mb-md-0 position-relative"
          >
            <Image
              src={aboutImage}
              alt="Về chúng tôi"
              fluid
              rounded
              className="shadow"
            />

            {/* Box thống kê học viên */}
            <div className="about-us-with-image__stat-box">
              <div className="about-us-with-image__stat-content">
                <FontAwesomeIcon
                  icon={faGem}
                  className="about-us-with-image__icon"
                />
                <div>
                  <h3>Học viên</h3>
                  <p>1120+</p>
                </div>
              </div>
            </div>
          </Col>

          {/* Nội dung bên phải */}
          <Col
            xs={12}
            md={6}
            className="about-us-with-image__text"
          >
            <p className="about-us-with-label">Về Chúng Tôi</p>
            <h2 className="about-us-with-image__title">
              Triết lí giáo dục và đào tạo
            </h2>
            <p>
              Với sứ mệnh đào tạo và phát triển nguồn nhân lực có trình độ
              chuyên môn cho sự phát triển kinh tế, Design24 đặt tiêu chí phát
              triển bản thân, nghề nghiệp và sự hài lòng của học viên lên hàng
              đầu.
            </p>
            <ul className="about-us-with-image__list">
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="list-icon"
                />
                Lộ trình khóa học rõ ràng
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="list-icon"
                />
                Học thực hành 100%
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="list-icon"
                />
                Hỗ trợ học viên tận tình
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="list-icon"
                />
                Giảng viên chất lượng
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="list-icon"
                />
                Linh hoạt thời gian
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="list-icon"
                />
                Chứng chỉ/ Chứng nhận khi hoàn thành khóa học
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutUsWithImage;
