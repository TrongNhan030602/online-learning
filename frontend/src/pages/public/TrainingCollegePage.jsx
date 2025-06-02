import { Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faBookOpen,
  faGlobe,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import collegeImg from "@/assets/img/landing/cao-dang-trung-cap.png";
import "../../styles/landing/training-page/training-detail-college.css";

const TrainingCollegePage = () => {
  return (
    <div className="training-college">
      {/* Tiêu đề chính */}
      <Row className="mb-4">
        <Col md={12}>
          <h1 className="training-college__title">
            <FontAwesomeIcon
              icon={faSchool}
              className="me-2"
            />
            Cao đẳng
          </h1>
        </Col>
      </Row>

      {/* Ảnh banner + chú thích */}
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

      {/* Phần Cao đẳng Thiết kế Đồ họa */}
      <Row className="mb-5">
        <Col md={12}>
          <h2 className="training-college__section-title">
            I. CAO ĐẲNG THIẾT KẾ ĐỒ HỌA
          </h2>
          <p className="training-college__section-desc">
            Thiết kế Đồ họa là một ngành học thú vị và sáng tạo, kết hợp giữa
            nghệ thuật và công nghệ để tạo ra các sản phẩm truyền thông ấn tượng
            như quảng cáo, logo, ấn phẩm in ấn, bao bì sản phẩm… Chương trình
            Cao đẳng Thiết kế Đồ họa tại Học viện Design24 sẽ giúp bạn khám phá,
            phát triển và hoàn thiện kỹ năng thiết kế của mình, để tự tin làm
            việc trong lĩnh vực đầy năng động này.
          </p>
          <h5>Bạn sẽ học những gì?</h5>
          <ul className="training-college__list">
            <li>Nguyên lý mỹ thuật cơ bản: màu sắc, bố cục, hình khối</li>
            <li>
              Kỹ năng sử dụng các phần mềm đồ họa chuyên nghiệp (như Adobe
              Photoshop, Illustrator, InDesign)
            </li>
            <li>
              Thiết kế logo, bộ nhận diện thương hiệu, poster, tạp chí, bao bì
              sản phẩm
            </li>
            <li>Sản xuất TVC quảng cáo, truyền thông, hoạt hình 2D, 3D</li>
            <li>Chụp ảnh, xử lý và chỉnh sửa hình ảnh, minh họa kỹ thuật số</li>
            <li>
              Thực hành với các dự án thực tế, giúp rèn luyện kỹ năng và xây
              dựng portfolio cá nhân
            </li>
          </ul>
          <h5>Sau khi tốt nghiệp, bạn sẽ có thể:</h5>
          <ul className="training-college__list">
            <li>
              Làm việc trong các công ty quảng cáo, thiết kế, truyền thông, in
              ấn
            </li>
            <li>
              Thiết kế các sản phẩm quảng cáo, ấn phẩm in ấn hoặc kỹ thuật số
            </li>
            <li>
              Tiếp tục học nâng cao lên bậc Đại học hoặc các chuyên ngành thiết
              kế khác
            </li>
            <li>
              Tự tin sáng tạo và làm việc trong môi trường đa dạng, hiện đại
            </li>
          </ul>
          <h5>Đặc điểm nổi bật của chương trình:</h5>
          <ul className="training-college__list">
            <li>
              Chú trọng thực hành, giúp bạn thành thạo phần mềm và phát triển tư
              duy thiết kế
            </li>
            <li>
              Môi trường học tập năng động, hỗ trợ bạn khám phá và phát triển
              phong cách cá nhân
            </li>
            <li>
              Cơ hội thực tập và làm việc với các doanh nghiệp trong ngành, tích
              lũy kinh nghiệm thực tế
            </li>
          </ul>
        </Col>
      </Row>

      {/* Phần Truyền thông Đa phương tiện */}
      <Row className="mb-5">
        <Col md={12}>
          <h2 className="training-college__section-title">
            II. TRUYỀN THÔNG ĐA PHƯƠNG TIỆN
          </h2>
          <p className="training-college__section-desc">
            Truyền thông Đa phương tiện là một ngành học kết hợp giữa công nghệ,
            thiết kế và nội dung sáng tạo. Ngành này tập trung vào việc sản xuất
            các sản phẩm truyền thông số như video, hoạt hình, âm thanh, website
            và các ứng dụng tương tác, phục vụ nhu cầu truyền thông – quảng cáo
            – giải trí ngày càng đa dạng.
          </p>
          <p className="training-college__section-desc">
            Chương trình Cao đẳng Truyền thông Đa phương tiện tại [Tên
            trường/đơn vị] sẽ giúp bạn xây dựng nền tảng vững chắc về kỹ thuật,
            kỹ năng sáng tạo và khả năng sản xuất nội dung đa phương tiện để tự
            tin làm việc trong ngành công nghiệp truyền thông hiện đại.
          </p>
          <h5>Bạn sẽ học những gì?</h5>
          <ul className="training-college__list">
            <li>Nguyên lý thiết kế hình ảnh động, âm thanh và video</li>
            <li>Kỹ năng quay phim, dựng phim, biên tập và xử lý hậu kỳ</li>
            <li>
              Thiết kế hoạt hình 2D cơ bản, motion graphics (đồ họa chuyển động)
            </li>
            <li>
              Sử dụng thành thạo các phần mềm sản xuất đa phương tiện như Adobe
              Premiere, After Effects, Audition
            </li>
            <li>Xây dựng và quản lý dự án truyền thông đa phương tiện</li>
          </ul>
          <h5>Sau khi tốt nghiệp, bạn có thể:</h5>
          <ul className="training-college__list">
            <li>
              Làm việc tại các công ty quảng cáo, truyền hình, studio sản xuất
              video, công ty truyền thông số
            </li>
            <li>
              Đảm nhận các vị trí như biên tập viên video, kỹ thuật viên dựng
              phim, thiết kế nội dung số
            </li>
            <li>
              Học tiếp lên bậc Đại học hoặc phát triển kỹ năng chuyên sâu hơn
              trong ngành
            </li>
            <li>
              Sáng tạo các sản phẩm truyền thông hấp dẫn, phù hợp với xu hướng
              của thị trường
            </li>
          </ul>
          <h5>Đặc điểm nổi bật của chương trình:</h5>
          <ul className="training-college__list">
            <li>
              Chú trọng thực hành, giúp bạn tự tin sản xuất các sản phẩm truyền
              thông ngay trong quá trình học
            </li>
            <li>
              Môi trường học tập sáng tạo, năng động và luôn bắt kịp xu hướng
              mới
            </li>
            <li>
              Cơ hội thực tập và tiếp xúc với doanh nghiệp, tích lũy kinh nghiệm
              và tạo dựng mạng lưới nghề nghiệp
            </li>
          </ul>
        </Col>
      </Row>

      {/* Card thông tin chung */}
      <Row className="training-college__cards justify-content-center">
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
