import { Link } from "react-router-dom";
import "../../styles/landing/program-showcase/programs-showcase.css";

import tkdh from "../../assets/img/landing/DESIGN24-01.jpg";
import ttdpt from "../../assets/img/landing/DESIGN24-02.jpg";
import hh2d from "../../assets/img/landing/DESIGN24-03.jpg";
import hh3d from "../../assets/img/landing/DESIGN24-04.jpg";
import dhtt from "../../assets/img/landing/DESIGN24-05.jpg";
import tkuiux from "../../assets/img/landing/DESIGN24-06.jpg";

const ProgramsShowcase = () => {
  const programs = [
    {
      id: 1,
      name: "Thiết kế đồ họa",
      image: tkdh,
    },
    {
      id: 2,
      name: "Truyền thông đa phương tiện",
      image: ttdpt,
    },
    {
      id: 3,
      name: "Hoạt hình 2d",
      image: hh2d,
    },
    {
      id: 4,
      name: "Hoạt hình 3 d",
      image: hh3d,
    },
    {
      id: 5,
      name: "Đồ họa truyền hình",
      image: dhtt,
    },
    {
      id: 6,
      name: "Thiết kế UI/UX",
      image: tkuiux,
    },
  ];

  return (
    <section className="programs">
      <h2 className="programs__title">Chuyên ngành đào tạo</h2>
      <div className="programs__list">
        {programs.map((prog) => (
          <Link
            key={prog.id}
            to={`/#`}
            // to={`/program/${prog.id}`}
            state={prog} // ← truyền toàn bộ object qua state
            className="programs__item"
          >
            {/* <div className="programs__overlay">
              <h3 className="programs__name">{prog.name}</h3>
            </div> */}
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
