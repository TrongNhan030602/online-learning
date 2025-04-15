import "../../styles/landing/features-section.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptopCode,
  faUserGraduate,
  faChartLine,
  faClock,
  faChalkboardTeacher,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";

const FeaturesSection = () => {
  const features = [
    {
      icon: faLaptopCode,
      title: "Bài giảng thực chiến",
      description:
        "Các bài học được xây dựng từ dự án thực tế, giúp bạn học đi đôi với hành.",
    },
    {
      icon: faUserGraduate,
      title: "Lộ trình rõ ràng",
      description:
        "Chia nhỏ theo cấp độ – định hướng phát triển từ cơ bản đến nâng cao.",
    },
    {
      icon: faChartLine,
      title: "Theo dõi tiến độ",
      description: "Ghi nhận sự tiến bộ từng bước và thống kê kết quả học tập.",
    },
    {
      icon: faClock,
      title: "Học linh hoạt",
      description: "Truy cập mọi lúc, mọi nơi – không giới hạn thời gian.",
    },
    {
      icon: faChalkboardTeacher,
      title: "Mentor hỗ trợ",
      description:
        "Giảng viên, mentor luôn đồng hành – sẵn sàng giải đáp mọi thắc mắc.",
    },
    {
      icon: faMobileAlt,
      title: "Đa nền tảng",
      description:
        "Học trên web, điện thoại hoặc tablet – tối ưu cho mọi thiết bị.",
    },
  ];

  return (
    <section className="features">
      <div className="container">
        <h2 className="features__title">Tính năng nổi bật</h2>
        <div className="features__grid">
          {features.map((feature, index) => (
            <div
              className={`features__item feature--${index}`}
              key={index}
            >
              <div className={`features__icon icon--${index}`}>
                <FontAwesomeIcon icon={feature.icon} />
              </div>

              <h3 className="features__name">{feature.title}</h3>
              <p className="features__description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
