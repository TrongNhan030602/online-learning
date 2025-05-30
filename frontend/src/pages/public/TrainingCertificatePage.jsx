import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

import certificate1 from "@/assets/img/landing/chung-chi-1.png";
import certificate2 from "@/assets/img/landing/chung-chi-2.png";
import "../../styles/landing/training-page/training-detail-certificate.css";

const TrainingCertificatePage = () => {
  return (
    <div className="certificate">
      <Row className="mb-4">
        <Col>
          <h1 className="certificate__title">
            <FontAwesomeIcon
              icon={faBolt}
              className="me-2"
            />
            SƠ CẤP
          </h1>
          <p className="certificate__desc">
            Tại Học viện Design24 chúng tôi hiểu rằng mọi hành trình lớn đều bắt
            đầu từ những bước đi đầu tiên. Chương trình đào tạo sơ cấp được
            thiết kế dành riêng cho những ai muốn khám phá thế giới thiết kế,
            truyền thông đa phương tiện và sản xuất video, giúp bạn xây dựng nền
            tảng vững chắc để phát triển sự nghiệp sáng tạo trong tương lai.
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="certificate__subtitle">
            Điều gì khiến chương trình sơ cấp của chúng tôi đặc biệt?
          </h2>
          <ul className="certificate__list">
            <li>
              Kiến thức căn bản và toàn diện: Giúp bạn làm quen với tư duy thiết
              kế, công cụ sáng tạo và các kỹ năng cốt lõi.
            </li>
            <li>
              Phương pháp học tập thực tiễn: Kết hợp lý thuyết cùng các dự án
              ứng dụng thực tế, đảm bảo học viên hiểu sâu và làm được.
            </li>
            <li>
              Đội ngũ giảng viên chuyên nghiệp: Được hướng dẫn bởi các chuyên
              gia giàu kinh nghiệm trong ngành thiết kế, truyền thông và hoạt
              hình.
            </li>
            <li>
              Tư vấn định hướng nghề nghiệp: Hỗ trợ học viên tìm kiếm con đường
              phát triển phù hợp và tiềm năng trong lĩnh vực sáng tạo.
            </li>
          </ul>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="certificate__subtitle">Ai nên tham gia?</h2>
          <p className="certificate__desc">
            Chương trình sơ cấp phù hợp với mọi đối tượng: từ người mới bắt đầu,
            học sinh – sinh viên, đến những ai đang muốn khám phá hoặc chuyển
            hướng sang lĩnh vực thiết kế, truyền hình và truyền thông đa phương
            tiện.
          </p>
        </Col>
      </Row>

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
