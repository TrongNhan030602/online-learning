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
import img19 from "../../assets/img/landing/dau-an-thanh-cong-19.jpg";
import img20 from "../../assets/img/landing/dau-an-thanh-cong-20.jpg";
import img21 from "../../assets/img/landing/dau-an-thanh-cong-21.jpg";
import img22 from "../../assets/img/landing/dau-an-thanh-cong-22.jpg";
import img23 from "../../assets/img/landing/dau-an-thanh-cong-23.jpg";
import img24 from "../../assets/img/landing/dau-an-thanh-cong-24.jpg";

import "../../styles/landing/success-highlights-section.css";

const column1Images = [img15, [img6, img3], img4, [img5, img10]];
const column2Images = [[img7, img9], img8, [img17, img18], img12];
const column3Images = [img13, [img16, img1], img14, [img2, img20]];
const column4Images = [[img19, img11], img21, [img22, img23], img24];

const SuccessHighlightsSection = () => {
  return (
    <section className="success-highlights">
      <div className="success-highlights__container">
        <h2 className="success-highlights__title">Dấu ấn thành công</h2>
        <p className="success-highlights__description">
          Những khoảnh khắc ghi lại hành trình trưởng thành và bứt phá của học
          viên
        </p>
        <div className="success-highlights__grid">
          {[column1Images, column2Images, column3Images, column4Images].map(
            (col, colIndex) => (
              <div
                key={colIndex}
                className="success-highlights__column"
              >
                {col.map((item, rowIdx) =>
                  Array.isArray(item) ? (
                    <div
                      className="success-highlights__row success-highlights__row--small-pair"
                      key={rowIdx}
                    >
                      {item.map((img, idx) => (
                        <div
                          className="success-highlights__item small"
                          key={idx}
                        >
                          <img
                            src={img}
                            alt={`Highlight`}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="success-highlights__row success-highlights__row--large"
                      key={rowIdx}
                    >
                      <div className="success-highlights__item large">
                        <img
                          src={item}
                          alt={`Highlight`}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default SuccessHighlightsSection;
