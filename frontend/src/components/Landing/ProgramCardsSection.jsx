import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faLaptopCode,
  faClock,
  faRocket,
  faMicrochip,
} from "@fortawesome/free-solid-svg-icons";

import img1 from "../../assets/img/landing/ctdt-01.jpg";
import img2 from "../../assets/img/landing/ctdt-02.jpg";
import img3 from "../../assets/img/landing/ctdt-03.jpg";
import img4 from "../../assets/img/landing/ctdt-04.jpg";
import img5 from "../../assets/img/landing/ctdt-05.jpg";

import "../../styles/landing/program-cards-section.css";

const programs = [
  {
    title: "Cao đẳng",
    description:
      "Đào tạo chuyên sâu, kết hợp lý thuyết và thực hành để sẵn sàng làm việc.",
    image: img1,
    icon: faGraduationCap,
    link: "/training/college", // <-- bạn đổi link ở đây
  },
  {
    title: "Trung cấp",
    description:
      "Trang bị kiến thức nghề nghiệp và kỹ năng thực hành thiết yếu.",
    image: img2,
    icon: faLaptopCode,
    link: "/training/intermediate",
  },
  {
    title: "Sơ cấp",
    description: "Đào tạo nhanh, thực tế dành cho người mới bắt đầu.",
    image: img3,
    icon: faRocket,
    link: "/training/certificate",
  },
  {
    title: "Ngắn hạn",
    description:
      "Các khóa học cấp tốc trong thời gian ngắn, linh hoạt và hiệu quả.",
    image: img4,
    icon: faClock,
    link: "/training/certificate",
  },
  {
    title: "Phần mềm",
    description:
      "Chuyên sâu về kỹ năng sử dụng và phát triển phần mềm ứng dụng.",
    image: img5,
    icon: faMicrochip,
    link: "/training/software",
  },
];

const ProgramCardsSection = () => {
  return (
    <section className="program-cards">
      <h2 className="program-cards__title">Chương Trình Đào Tạo</h2>
      <div className="program-cards__container">
        {programs.map((program, index) => (
          <a
            href={program.link}
            key={index}
            className="program-card-link"
            aria-label={`Đi đến chương trình ${program.title}`}
          >
            <div className="program-card">
              <h3 className="program-card__title">
                {program.title}
                <FontAwesomeIcon
                  icon={program.icon}
                  className="program-card__icon"
                />
              </h3>
              <img
                src={program.image}
                alt={program.title}
                className="program-card__image"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ProgramCardsSection;
