// ProgramTimeline.jsx
import "../../styles/landing/program-timeline.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faBook,
  faLaptopCode,
  faUserCheck,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const steps = [
  {
    icon: faLightbulb,
    title: "Khám phá & định hướng",
    description:
      "Chọn lĩnh vực phù hợp, hiểu rõ nhu cầu học và mục tiêu nghề nghiệp.",
  },
  {
    icon: faBook,
    title: "Học kiến thức nền tảng",
    description:
      "Làm quen với công cụ, khái niệm cơ bản và kiến thức chuyên ngành.",
  },
  {
    icon: faLaptopCode,
    title: "Thực hành dự án thật",
    description:
      "Áp dụng vào các bài tập, mini project, mô phỏng môi trường thật.",
  },
  {
    icon: faUserCheck,
    title: "Được mentor hỗ trợ",
    description:
      "Nhận feedback, cải thiện kỹ năng, được định hướng bởi chuyên gia.",
  },
  {
    icon: faRocket,
    title: "Sẵn sàng cho nghề nghiệp",
    description:
      "Xây dựng portfolio, phỏng vấn thử, và giới thiệu cơ hội nghề nghiệp.",
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 800,
  cssEase: "ease-in-out",
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true, // Bật chế độ tự động chạy
  autoplaySpeed: 3000, // Mỗi slide chạy trong 3 giây
  arrows: true,
  pauseOnHover: true,
  draggable: true, // Cho phép kéo bằng chuột (PC)
  swipe: true, // Cho phép vuốt bằng tay (mobile)
  touchMove: true, // Bật thao tác chạm
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const ProgramTimeline = () => {
  return (
    <section className="program-timeline">
      <div className="snow-overlay"></div>
      <div className="container">
        <h2 className="program-timeline__title">Lộ trình học tập</h2>
        <div className="program-timeline__slider">
          <Slider {...settings}>
            {steps.map((step, index) => (
              <div
                className="program-timeline__step-wrapper"
                key={index}
              >
                <div className="program-timeline__step">
                  <div className="program-timeline__step-header">
                    <div className="program-timeline__step-icon">
                      <FontAwesomeIcon icon={step.icon} />
                    </div>
                    <h3 className="program-timeline__step-title">
                      {index + 1}. {step.title}
                    </h3>
                  </div>
                  <p className="program-timeline__step-desc">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default ProgramTimeline;
