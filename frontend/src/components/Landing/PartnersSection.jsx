import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/landing/partners-section.css";

// Import tất cả 24 logo
import dt1 from "@/assets/img/landing/doi-tac-hop-tac-01.webp";
import dt2 from "@/assets/img/landing/doi-tac-hop-tac-02.webp";
import dt3 from "@/assets/img/landing/doi-tac-hop-tac-03.webp";
import dt4 from "@/assets/img/landing/doi-tac-hop-tac-04.webp";
import dt5 from "@/assets/img/landing/doi-tac-hop-tac-05.webp";
import dt6 from "@/assets/img/landing/doi-tac-hop-tac-06.webp";
import dt7 from "@/assets/img/landing/doi-tac-hop-tac-07.webp";
import dt8 from "@/assets/img/landing/doi-tac-hop-tac-08.webp";
import dt9 from "@/assets/img/landing/doi-tac-hop-tac-09.webp";
import dt10 from "@/assets/img/landing/doi-tac-hop-tac-10.webp";
import dt11 from "@/assets/img/landing/doi-tac-hop-tac-11.webp";
import dt12 from "@/assets/img/landing/doi-tac-hop-tac-12.webp";
import dt13 from "@/assets/img/landing/doi-tac-hop-tac-13.webp";
import dt14 from "@/assets/img/landing/doi-tac-hop-tac-14.webp";
import dt15 from "@/assets/img/landing/doi-tac-hop-tac-15.webp";
import dt16 from "@/assets/img/landing/doi-tac-hop-tac-16.webp";
import dt17 from "@/assets/img/landing/doi-tac-hop-tac-17.webp";
import dt18 from "@/assets/img/landing/doi-tac-hop-tac-18.webp";
import dt19 from "@/assets/img/landing/doi-tac-hop-tac-19.webp";
import dt20 from "@/assets/img/landing/doi-tac-hop-tac-20.webp";
import dt21 from "@/assets/img/landing/doi-tac-hop-tac-21.webp";
import dt22 from "@/assets/img/landing/doi-tac-hop-tac-22.webp";
import dt23 from "@/assets/img/landing/doi-tac-hop-tac-23.webp";
import dt24 from "@/assets/img/landing/doi-tac-hop-tac-24.webp";

const partners = [
  { name: "Đối tác 1", logo: dt1 },
  { name: "Đối tác 2", logo: dt2 },
  { name: "Đối tác 3", logo: dt3 },
  { name: "Đối tác 4", logo: dt4 },
  { name: "Đối tác 5", logo: dt5 },
  { name: "Đối tác 6", logo: dt6 },
  { name: "Đối tác 7", logo: dt7 },
  { name: "Đối tác 8", logo: dt8 },
  { name: "Đối tác 9", logo: dt9 },
  { name: "Đối tác 10", logo: dt10 },
  { name: "Đối tác 11", logo: dt11 },
  { name: "Đối tác 12", logo: dt12 },
  { name: "Đối tác 13", logo: dt13 },
  { name: "Đối tác 14", logo: dt14 },
  { name: "Đối tác 15", logo: dt15 },
  { name: "Đối tác 16", logo: dt16 },
  { name: "Đối tác 17", logo: dt17 },
  { name: "Đối tác 18", logo: dt18 },
  { name: "Đối tác 19", logo: dt19 },
  { name: "Đối tác 20", logo: dt20 },
  { name: "Đối tác 21", logo: dt21 },
  { name: "Đối tác 22", logo: dt22 },
  { name: "Đối tác 23", logo: dt23 },
  { name: "Đối tác 24", logo: dt24 },
];

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 600,
  slidesToShow: 6,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 4 } },
    { breakpoint: 768, settings: { slidesToShow: 3 } },
    { breakpoint: 480, settings: { slidesToShow: 2 } },
  ],
};

const PartnersSection = () => {
  return (
    <section className="partners">
      <div className="partners__container">
        <h2 className="partners__title">ĐỐI TÁC DESIGN24</h2>
        <Slider
          {...sliderSettings}
          className="partners__slider"
        >
          {partners.map((partner, index) => (
            <div
              key={index}
              className="partners__item"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="partners__logo"
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default PartnersSection;
