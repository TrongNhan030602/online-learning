import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "../../styles/landing/testimonials.css";
import img1 from "@/assets/img/landing/avatar-tn-01.webp";
import img2 from "@/assets/img/landing/avatar-tn-02.webp";
import img3 from "@/assets/img/landing/avatar-tn-03.webp";
import img4 from "@/assets/img/landing/avatar-tn-04.webp";
import img5 from "@/assets/img/landing/avatar-tn-05.webp";
import img6 from "@/assets/img/landing/avatar-tn-06.webp";
import img7 from "@/assets/img/landing/avatar-tn-07.webp";
import img8 from "@/assets/img/landing/avatar-tn-08.webp";
import img9 from "@/assets/img/landing/avatar-tn-09.webp";
import img10 from "@/assets/img/landing/avatar-tn-10.webp";
import img11 from "@/assets/img/landing/avatar-tn-11.webp";
import img12 from "@/assets/img/landing/avatar-tn-12.webp";
const testimonials = [
  // Thêm tổng cộng 12 học viên
  {
    name: "Hồ Thu Nguyệt",
    role: "Khóa 2D Animation",
    content:
      "Mình đã tự tin apply công việc thực tế sau khóa học tại Design24.",
    avatar: img2,
  },
  {
    name: "Trần Thị Lan Anh",
    role: "Khóa TVC Quảng Cáo",
    content: "Cách học qua dự án thật giúp mình tiếp cận công việc tốt hơn.",
    avatar: img3,
  },
  {
    name: "Lê Ngọc Hà",
    role: "Khóa quay phim chuyên nghiệp",
    content: "Lộ trình rõ ràng, hệ thống online hiện đại, mentor tận tâm!",
    avatar: img4,
  },
  {
    name: "Hoa Ý Nhựt Băng",
    role: "Khóa Dựng phim hậu kỳ",
    content: "Từ con số 0, mình đã nhận job dựng video chỉ sau 2 tháng học.",
    avatar: img5,
  },
  {
    name: "Ngô Cẩm Tú",
    role: "Khóa Thiết kế đồ họa",
    content: "Bài tập thực tế, mentor tâm huyết, cực kỳ hài lòng!",
    avatar: img6,
  },
  {
    name: "Lê Thị Thúy",
    role: "Khóa Animation 3D",
    content: "Khoá học giúp mình xây dựng portfolio ấn tượng để đi làm.",
    avatar: img7,
  },
  {
    name: "Lý Kim Anh",
    role: "Khóa Motion Graphics",
    content: "Mình đã tìm được hướng đi chuyên nghiệp sau khoá học.",
    avatar: img8,
  },
  {
    name: "Quách Kim Dung",
    role: "Khóa Dựng phim chuyên sâu",
    content: "Thực hành nhiều, giảng viên hỗ trợ kỹ lưỡng từng bước.",
    avatar: img9,
  },
  {
    name: "Nguyễn Ngọc Linh",
    role: "Khóa Kỹ xảo VFX",
    content: "Từng bước xây dựng kỹ năng để tự tin làm VFX thực tế.",
    avatar: img10,
  },
  {
    name: "Trần Quốc Bảo",
    role: "Khóa TVC & Viral",
    content: "Ứng dụng được ngay kiến thức, có cơ hội làm freelance.",
    avatar: img11,
  },
  {
    name: "Hoàng Thu Hương",
    role: "Khóa Biên tập nội dung",
    content: "Mình được học từ nền tảng đến kỹ năng dựng nội dung sáng tạo.",
    avatar: img12,
  },
  {
    name: "Lâm Đức Minh",
    role: "Khóa Sản xuất video TikTok",
    content: "Học thực tế, dễ hiểu, có mentor theo sát hướng dẫn tận tâm.",
    avatar: img1,
  },
];
const studentStories = [
  {
    image:
      "https://www.design24.edu.vn/front-end/assets/imgs/gallery/design24-19.jpg",
    description:
      "Từ người mới hoàn toàn, tôi đã tự tay dựng thành công TVC đầu tiên của mình.",
    date: "01/03/2024",
  },
  {
    image:
      "https://www.design24.edu.vn/front-end/assets/imgs/gallery/design24-1.jpg",
    description:
      "Được mentor đồng hành tận tình xuyên suốt quá trình, tôi cảm thấy vững tin hơn bao giờ hết.",
    date: "01/01/2024",
  },
  {
    image:
      "https://www.design24.edu.vn/front-end/assets/imgs/gallery/design24-18.jpg",
    description:
      "Hành trình học 3D từ con số 0 đến xây dựng portfolio cá nhân đẳng cấp.",
    date: "01/12/2023",
  },
  {
    image:
      "https://khoa-chuyen-nghiep.design24.edu.vn/static/media/design24-19.842323069c5c537b67a9.jpg",
    description:
      "Sau khóa học, tôi đã tự tin nhận dự án dựng phim thực tế đầu tiên.",
    date: "01/11/2023",
  },
  {
    image:
      "https://khoa-chuyen-nghiep.design24.edu.vn/static/media/design24-6.2548196d4a75d835bc5f.jpg",
    description:
      "Nhờ chỉ dẫn chi tiết của mentor, tôi tiến bộ vượt bậc từng ngày.",
    date: "01/10/2023",
  },
  {
    image:
      "https://khoa-chuyen-nghiep.design24.edu.vn/static/media/design24-3.11e4c6494ae415e3a1e3.jpg",
    description:
      "Portfolio cá nhân giúp tôi chinh phục thành công vị trí tại studio mơ ước.",
    date: "01/09/2023",
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 7000,
};

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const Testimonials = () => {
  const slides = chunk(testimonials, 6);
  const [visibleCount, setVisibleCount] = useState(3);
  const [expanded, setExpanded] = useState(false);

  const handleToggleStories = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 800) {
        setVisibleCount(expanded ? studentStories.length : 2);
      } else {
        setVisibleCount(expanded ? studentStories.length : 3);
      }
    };

    handleResize(); // Run on first mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expanded]);
  return (
    <section className="testimonials">
      <div className="testimonials__container">
        <h2 className="testimonials__title">
          Cảm nhận của học viên đã tốt nghiệp
        </h2>
        <Slider
          {...sliderSettings}
          className="testimonials__slider"
        >
          {slides.map((group, i) => (
            <div
              className="testimonials__slide"
              key={i}
            >
              <div className="testimonials__grid">
                {group.map((item, j) => (
                  <div
                    className="testimonials__card"
                    key={j}
                  >
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="testimonials__avatar"
                    />
                    <div className="testimonials__text">
                      <FontAwesomeIcon
                        icon={faQuoteLeft}
                        className="testimonials__quote-icon"
                      />
                      <p className="testimonials__content">“{item.content}”</p>
                      <div className="testimonials__user-info">
                        <p className="testimonials__name">{item.name}</p>
                        <p className="testimonials__role">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Slider>
        <div className="testimonials__stories">
          <h3 className="testimonials__subtitle">Câu chuyện của học viên</h3>
          <div className="testimonials__story-grid">
            {studentStories.slice(0, visibleCount).map((story, index) => (
              <div
                className="testimonials__story-card"
                key={index}
              >
                <img
                  src={story.image}
                  alt={`Story ${index + 1}`}
                  className="testimonials__story-image"
                />
                <div className="testimonials__story-content">
                  <p className="testimonials__story-date">{story.date}</p>
                  <p className="testimonials__story-desc">
                    {story.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonials__story-more">
            <button
              onClick={handleToggleStories}
              className="testimonials__story-link"
            >
              {expanded ? "Ẩn bớt" : "Xem thêm"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
