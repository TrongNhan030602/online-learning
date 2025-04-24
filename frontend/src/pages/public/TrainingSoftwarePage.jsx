import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import "../../styles/landing/training-page/training-software.css";
import softwareImg from "../../assets/img/landing/phan-mem.png";

const TrainingSoftwarePage = () => {
  return (
    <div className="training-software">
      <div className="training-software__text">
        <h1 className="training-software__title">
          <FontAwesomeIcon
            icon={faLaptopCode}
            className="me-2"
          />
          Chương Trình Đào Tạo Phần Mềm
        </h1>
        <p className="training-software__desc">
          Khoá học linh hoạt dành cho người muốn phát triển kỹ năng lập trình và
          sử dụng phần mềm chuyên nghiệp trong thời đại số.
        </p>
        <ul className="training-software__list">
          <li>Học các công cụ hiện đại: VS Code, Figma, GitHub</li>
          <li>Kỹ năng lập trình từ cơ bản đến nâng cao</li>
          <li>Ứng dụng thực tế qua dự án cuối khoá</li>
          <li>Phù hợp cho người mới bắt đầu hoặc trái ngành</li>
          <li>Cấp chứng nhận hoàn thành khoá học</li>
        </ul>
      </div>

      <div className="training-software__images">
        <div className="training-software__image-wrapper">
          <img
            src={softwareImg}
            alt="Khóa học phần mềm"
            className="training-software__image"
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingSoftwarePage;
