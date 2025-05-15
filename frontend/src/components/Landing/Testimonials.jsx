import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "../../styles/landing/testimonials.css";

const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "Junior Developer tại ABC Corp",
    content:
      "Sau khóa học tại Design24, mình đã tự tin apply công việc thực tế và nhận được offer chỉ sau 1 tháng. Cảm ơn mentor và đội ngũ hỗ trợ rất nhiệt tình!",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Trần Thị B",
    role: "UX/UI Designer tại Freelance",
    content:
      "Mình rất thích cách học qua dự án thật ở đây, không chỉ học kiến thức mà còn học được quy trình làm việc thực tế.",
    avatar: "https://i.pravatar.cc/100?img=21",
  },
  {
    name: "Lê Hằng",
    role: "Sinh viên năm 3 CNTT",
    content:
      "Thiết kế lộ trình rõ ràng, mentor hỗ trợ sát sao, đúng kiểu học để đi làm. Hệ thống học online nhưng rất chuyên nghiệp!",
    avatar: "https://i.pravatar.cc/100?img=40",
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: false,
};

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="testimonials__container">
        <h2 className="testimonials__title">Cảm nhận học viên</h2>
        <Slider
          className="testimonials__slider"
          {...sliderSettings}
        >
          {testimonials.map((item, index) => (
            <div
              className="testimonials__slide"
              key={index}
            >
              <div className="testimonials__card">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="testimonials__avatar"
                />
                <div className="testimonials__text-group">
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="testimonials__quote-icon"
                  />
                  <p className="testimonials__content">
                    &quot;{item.content}&quot;
                  </p>
                  <div className="testimonials__user-info">
                    <p className="testimonials__name">{item.name}</p>
                    <p className="testimonials__role">{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
