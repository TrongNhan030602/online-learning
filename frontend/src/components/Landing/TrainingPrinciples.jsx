import "../../styles/landing/training-principles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faUserGraduate,
  faChartLine,
  faHandsHelping,
} from "@fortawesome/free-solid-svg-icons";

const principles = [
  {
    icon: faChalkboardTeacher,
    title: "Giảng viên thực chiến",
    description:
      "100% giảng viên là những người đang làm nghề, giàu kinh nghiệm thực tế.",
  },
  {
    icon: faUserGraduate,
    title: "Học theo dự án",
    description:
      "Lấy dự án làm trung tâm giúp học viên làm thật, hiểu sâu, tự tin ứng dụng.",
  },
  {
    icon: faChartLine,
    title: "Cá nhân hóa lộ trình",
    description:
      "Lộ trình học được điều chỉnh phù hợp theo mục tiêu và tốc độ mỗi học viên.",
  },
  {
    icon: faHandsHelping,
    title: "Đồng hành 1-1",
    description:
      "Hỗ trợ tận tình qua mentor cá nhân, giải đáp mọi khó khăn trong quá trình học.",
  },
];

const TrainingPrinciples = () => {
  return (
    <section className="principles">
      <div className="container">
        <h2 className="principles__title">Nguyên tắc đào tạo tại Design24</h2>
        <div className="principles__grid">
          {principles.map((item, index) => (
            <div
              className="principles__item"
              key={index}
            >
              <div className="principles__icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <h3 className="principles__title-item">{item.title}</h3>
              <p className="principles__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingPrinciples;
