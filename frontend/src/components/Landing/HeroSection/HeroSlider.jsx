import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import slide1 from "../../../assets/img/landing/landing-slider1.jpg";
import slide2 from "../../../assets/img/landing/landing-slider2.jpg";
import "../../../styles/landing/hero-section/hero-slider.css";

const slides = [
  { id: 1, image: slide1, link: "#" },
  { id: 2, image: slide2, link: "#" },
];

const HeroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    draggable: true, // Cho phép kéo bằng chuột (PC)
    swipe: true, // Cho phép vuốt bằng tay (mobile)
    touchMove: true, // Bật thao tác chạm
    fade: false, // Tắt hiệu ứng mờ dần
  };

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div className="hero-slider__slide">
              <Link to={slide.link}>
                <img
                  src={slide.image}
                  alt={`Slide ${slide.id}`}
                  className="hero-slider__image"
                />
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
