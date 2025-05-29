import img1 from "../../assets/img/landing/dau-an-thanh-cong-01.jpg";
import img2 from "../../assets/img/landing/dau-an-thanh-cong-02.jpg";
import img3 from "../../assets/img/landing/dau-an-thanh-cong-03.jpg";
import img4 from "../../assets/img/landing/dau-an-thanh-cong-04.jpg";
import img5 from "../../assets/img/landing/dau-an-thanh-cong-05.jpg";
import img6 from "../../assets/img/landing/dau-an-thanh-cong-06.jpg";
import img7 from "../../assets/img/landing/dau-an-thanh-cong-07.jpg";
import img8 from "../../assets/img/landing/dau-an-thanh-cong-08.jpg";
import img9 from "../../assets/img/landing/dau-an-thanh-cong-09.jpg";
import img10 from "../../assets/img/landing/dau-an-thanh-cong-10.jpg";
import img11 from "../../assets/img/landing/dau-an-thanh-cong-11.jpg";
import img12 from "../../assets/img/landing/dau-an-thanh-cong-12.jpg";
import img13 from "../../assets/img/landing/dau-an-thanh-cong-13.jpg";
import img14 from "../../assets/img/landing/dau-an-thanh-cong-14.jpg";
import img15 from "../../assets/img/landing/dau-an-thanh-cong-15.jpg";
import img16 from "../../assets/img/landing/dau-an-thanh-cong-16.jpg";
import img17 from "../../assets/img/landing/dau-an-thanh-cong-17.jpg";
import img18 from "../../assets/img/landing/dau-an-thanh-cong-18.jpg";

import "../../styles/landing/success-highlights-section.css";

const images = [
  img1,
  img4,
  img2,
  img5,
  img3,
  img6,
  img7,
  img10,
  img8,
  img11,
  img9,
  img12,
  img13,
  img15,
  img14,
  img16,
  img17,
  img18,
];

const SuccessHighlightsSection = () => {
  return (
    <section className="success-highlights">
      <div className="success-highlights__container">
        <h2 className="success-highlights__title">Dấu ấn thành công</h2>
        <p className="success-highlights__description">
          Những khoảnh khắc ghi lại hành trình trưởng thành và bứt phá của học
          viên
        </p>
        <div className="success-highlights__columns">
          {images.map((img, idx) => (
            <div
              className="success-highlights__item"
              key={idx}
            >
              <img
                src={img}
                alt={`Highlight ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessHighlightsSection;
