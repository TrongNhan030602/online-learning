import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools } from "@fortawesome/free-solid-svg-icons";
import intermediateImg1 from "@/assets/img/landing/cao-dang-trung-cap.png";
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
            Trung cấp
          </h1>

          {/* Ảnh nằm ngay dưới tiêu đề TRUNG CẤP */}
          <div className="intermediate__image-wrapper mb-4">
            <img
              src={intermediateImg1}
              alt="Chương trình đào tạo Trung Cấp"
              className="intermediate__image"
            />
          </div>

          <h2 className="intermediate__subtitle">
            🌟 Ngành Thiết kế Đồ họa – Nghệ Thuật Của Thời Đại Số
          </h2>
          <p className="intermediate__desc">
            Thiết kế Đồ họa không chỉ là công cụ biến ý tưởng thành hình ảnh, mà
            còn là cách kể câu chuyện và thu hút khách hàng trong thời đại kỹ
            thuật số. Ngành học này kết hợp tư duy sáng tạo, khả năng nghệ thuật
            và công nghệ hiện đại, mang đến những sản phẩm độc đáo và ấn tượng.
          </p>
          <ul className="intermediate__list">
            <li>
              ✅ Nhu cầu tuyển dụng lớn: Doanh nghiệp nào cũng cần thiết kế để
              xây dựng thương hiệu và truyền thông.
            </li>
            <li>
              ✅ Cơ hội nghề nghiệp đa dạng: Thiết kế nhận diện thương hiệu,
              quảng cáo, truyền thông, in ấn, thiết kế web…
            </li>
            <li>
              ✅ Khả năng làm việc tự do: Thiết kế đồ họa còn mở ra cơ hội
              freelance, tự do sáng tạo và tăng thu nhập.
            </li>
            <li>
              ✅ Sáng tạo không giới hạn: Môi trường học tập và làm việc luôn
              đổi mới, giúp bạn phát triển tư duy nghệ thuật.
            </li>
          </ul>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h2 className="intermediate__subtitle">
            🌟 Ngành Truyền thông Đa phương tiện – Dẫn Dắt Cảm Xúc & Kết Nối
            Khán Giả
          </h2>
          <p className="intermediate__desc">
            Truyền thông Đa phương tiện kết hợp sức mạnh của hình ảnh, âm thanh,
            video và công nghệ số để tạo ra những câu chuyện lôi cuốn và mang
            thông điệp mạnh mẽ. Ngành học này là “vũ khí” quan trọng của các
            doanh nghiệp trong việc tiếp cận khách hàng, xây dựng thương hiệu và
            quảng bá sản phẩm.
          </p>
          <ul className="intermediate__list">
            <li>
              ✅ Nắm bắt xu hướng truyền thông hiện đại: Video marketing, mạng
              xã hội, truyền thông kỹ thuật số phát triển bùng nổ.
            </li>
            <li>
              ✅ Cơ hội nghề nghiệp rộng mở: Làm việc tại các công ty truyền
              thông, sản xuất video, agency quảng cáo…
            </li>
            <li>
              ✅ Kỹ năng sáng tạo toàn diện: Kết hợp thiết kế, quay dựng, biên
              tập và quản lý nội dung.
            </li>
            <li>
              ✅ Khả năng thích ứng cao: Có thể làm việc trong nhiều lĩnh vực:
              báo chí, truyền thông giải trí, thương mại điện tử…
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default TrainingIntermediatePage;
