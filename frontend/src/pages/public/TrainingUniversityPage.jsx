import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faBullhorn,
  faTv,
  faCouch,
  faFilm,
  faCube,
  faGamepad,
  faMagic,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/landing/training-page/training-detail-university.css";

const majors = [
  {
    title: "Đồ họa quảng cáo",
    icon: faBullhorn,
    description:
      "Tập trung vào thiết kế hình ảnh, truyền tải thông điệp quảng bá sản phẩm và thương hiệu qua các phương tiện truyền thông khác nhau.",
  },
  {
    title: "Đồ họa truyền hình",
    icon: faTv,
    description:
      "Phát triển kỹ năng thiết kế đồ họa phục vụ sản xuất chương trình truyền hình, hiệu ứng hình ảnh và bản tin.",
  },
  {
    title: "Đồ họa kiến trúc nội thất",
    icon: faCouch,
    description:
      "Ứng dụng đồ họa trong thiết kế không gian nội thất, kiến trúc, giúp thể hiện ý tưởng và mô phỏng các công trình một cách sinh động.",
  },
  {
    title: "Hoạt hình 2D",
    icon: faFilm,
    description:
      "Đào tạo kỹ thuật, nghệ thuật sản xuất phim hoạt hình 2D truyền thống và kỹ thuật số.",
  },
  {
    title: "Hoạt hình 3D",
    icon: faCube,
    description:
      "Tập trung vào tạo dựng các mô hình, nhân vật và hiệu ứng 3 chiều phục vụ phim hoạt hình, game và truyền thông đa phương tiện.",
  },
  {
    title: "Game 3D",
    icon: faGamepad,
    description:
      "Trang bị kiến thức về thiết kế, lập trình và phát triển các sản phẩm game 3D hiện đại.",
  },
  {
    title: "Kỹ xảo điện ảnh",
    icon: faMagic,
    description:
      "Đào tạo kỹ thuật tạo hiệu ứng hình ảnh đặc biệt, chỉnh sửa hậu kỳ, và các công đoạn kỹ xảo trong sản xuất phim điện ảnh.",
  },
  {
    title: "Thiết kế UI/UX",
    icon: faMobileAlt,
    description:
      "Tập trung vào thiết kế giao diện người dùng (UI) và trải nghiệm người dùng (UX) trong các sản phẩm số như website, ứng dụng di động.",
  },
];

const TrainingUniversityPage = () => {
  return (
    <Container className="training-university">
      <h1 className="training-university__title">
        <FontAwesomeIcon icon={faGraduationCap} /> Đại học
      </h1>
      <p className="training-university__intro">
        Chương trình đào tạo Đại học Thiết kế Đồ họa tại Design24 được xây dựng
        nhằm trang bị cho sinh viên kiến thức chuyên sâu và kỹ năng thực tiễn
        trong lĩnh vực thiết kế sáng tạo đa dạng. Chương trình gồm 8 chuyên
        ngành chuyên biệt, đáp ứng nhu cầu phát triển đa dạng của ngành công
        nghiệp sáng tạo hiện nay:
      </p>

      <Row className="training-university__majors">
        {majors.map((major, idx) => (
          <Col
            md={6}
            lg={3}
            key={idx}
            className="training-university__major"
          >
            <Card className="training-university__card">
              <Card.Body>
                <div className="training-university__icon">
                  <FontAwesomeIcon
                    icon={major.icon}
                    size="2x"
                  />
                </div>
                <Card.Title className="training-university__card-title">
                  {major.title}
                </Card.Title>
                <Card.Text className="training-university__card-desc">
                  {major.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="training-university__note">
        <p>
          Chương trình không chỉ cung cấp kiến thức chuyên môn mà còn nhấn mạnh
          thực hành, dự án thực tế, giúp sinh viên phát triển năng lực sáng tạo
          và khả năng làm việc chuyên nghiệp trong môi trường đa ngành.
        </p>
      </div>
    </Container>
  );
};

export default TrainingUniversityPage;
