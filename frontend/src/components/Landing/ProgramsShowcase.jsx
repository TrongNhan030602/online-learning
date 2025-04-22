import { Link } from "react-router-dom";
import "../../styles/landing/program-showcase/programs-showcase.css";

import graphicImage from "../../assets/img/landing/banner-3d-animation.jpg";
import architectureImage from "../../assets/img/landing/banner-visual-effects-768x768.jpg";
import vfxImage from "../../assets/img/landing/banner-game-art-design-768x768.jpg";

const ProgramsShowcase = () => {
  const programs = [
    {
      id: 1,
      name: "Thiết kế đồ họa quảng cáo",
      image: graphicImage,
    },
    {
      id: 2,
      name: "Thiết kế đồ hoạ kiến trúc nội thất",
      image: architectureImage,
    },
    {
      id: 3,
      name: "Thiết kế đồ hoạ kỹ xảo phim ảnh",
      image: vfxImage,
    },
    {
      id: 4,
      name: "Thiết kế đồ hoạ kỹ xảo phim ảnh",
      image: vfxImage,
    },
    {
      id: 5,
      name: "Thiết kế đồ hoạ kỹ xảo phim ảnh",
      image: vfxImage,
    },
  ];

  return (
    <section className="programs">
      <h2 className="programs__title">Chương trình đào tạo</h2>
      <div className="programs__list">
        {programs.map((prog) => (
          <Link
            key={prog.id}
            to={`/#`}
            // to={`/program/${prog.id}`}
            state={prog} // ← truyền toàn bộ object qua state
            className="programs__item"
          >
            <div className="programs__overlay">
              <h3 className="programs__name">{prog.name}</h3>
            </div>
            <div className="programs__image-wrapper">
              <img
                src={prog.image}
                alt={prog.name}
                className="programs__image"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProgramsShowcase;
