import { Container, Row, Col, Image } from "react-bootstrap";
import introImage from "../../../assets/img/landing/about/about-img.jpg"; // Import ảnh từ src/assets
import "../../../styles/landing/about/about-page.css";

const AboutIntro = () => {
  return (
    <section className="about-page__intro">
      <Container>
        <Row className="align-items-center">
          {/* Ảnh - nằm trên ở mobile, bên phải ở desktop */}
          <Col
            xs={12}
            md={{ span: 6, order: 2 }}
            className="about-page__intro-image mb-4 mb-md-0"
          >
            <Image
              src={introImage}
              alt="Design24 Academy"
              fluid
              rounded
              className="shadow"
            />
          </Col>

          {/* Nội dung - nằm dưới ở mobile, bên trái ở desktop */}
          <Col
            xs={12}
            md={{ span: 6, order: 1 }}
            className="about-page__intro-text"
          >
            <p className="about-page__label">Giới thiệu</p>
            <h1 className="about-page__title"> Học viện Design24</h1>
            <p className="about-page__subtitle">
              Học viện Design24 là một trong những trung tâm đào tạo uy tín và
              chất lượng hàng đầu trong lĩnh vực Thiết kế đồ họa, Dựng phim, Kỹ
              xảo điện ảnh,... đồng thời cũng cung cấp các dịch vụ liên quan
              trong khu vực và khắp cả nước.
            </p>
            <p>
              Với kinh nghiệm thực hiện nhiều dự án với các Đài truyền hình
              &amp; các thương hiệu hàng đầu Việt Nam, chúng tôi tự hào có thể
              định hướng đúng đắn, mang lại những kiến thức và tư duy sáng tạo
              cho các bạn.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutIntro;
