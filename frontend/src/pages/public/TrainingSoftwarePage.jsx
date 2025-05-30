import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import softwareImg from "@/assets/img/landing/phan-mem.png";
import "../../styles/landing/training-page/training-software.css";

const softwareList = [
  "Adobe Photoshop — Phần mềm chỉnh sửa ảnh và thiết kế đồ họa phổ biến nhất.",
  "Adobe Illustrator — Thiết kế vector, minh họa, logo chuyên nghiệp.",
  "CorelDraw — Công cụ đồ họa vector cho in ấn, quảng cáo.",
  "Adobe InDesign — Thiết kế dàn trang sách báo, tạp chí.",
  "Adobe Premiere — Dựng phim và chỉnh sửa video từ cơ bản đến nâng cao.",
  "Adobe After Effect — Tạo hiệu ứng động và kỹ xảo video ấn tượng.",
  "Autodesk 3D Max — Dựng hình và mô phỏng 3D cho kiến trúc, nội thất.",
  "Blender — Công cụ mã nguồn mở toàn diện dựng hình 3D và hoạt hình.",
  "Cinema 4D — Dựng hình và mô phỏng chuyển động 3D trong quảng cáo.",
  "Sketch Up — Thiết kế mô hình 3D đơn giản, nhanh chóng.",
  "Autodesk Maya — Giải pháp dựng hình 3D và hoạt hình phim ảnh, game.",
  "Unreal Engine — Thiết kế game 3D, mô phỏng VR, làm phim.",
  "Nuke studio — Hậu kỳ và kỹ xảo phim ảnh chuyên nghiệp chuẩn Hollywood.",
];

const benefitList = [
  "Giảng viên hướng dẫn chuyên nghiệp, giàu kinh nghiệm thực tiễn.",
  "Giáo trình cập nhật, phương pháp học tập thực hành.",
  "Ứng dụng trực tiếp vào dự án thực tế, phát triển tư duy sáng tạo.",
  "Cấp chứng chỉ hoàn thành khóa học, giá trị trong nghề nghiệp.",
];

const TrainingSoftwarePage = () => {
  return (
    <div className="training-software-page">
      <h1 className="training-software-page__header">
        {" "}
        <FontAwesomeIcon
          icon={faLaptopCode}
          className="me-2"
        />
        Phần Mềm
      </h1>

      <div className="training-software">
        <div className="training-software__left">
          <h2 className="training-software__title">
            Khóa Học Phần Mềm – Chìa Khóa Để Làm Chủ Công Cụ Sáng Tạo
          </h2>
          <p className="training-software__desc">
            Tại Học viện <strong>Design24</strong>, chúng tôi mang đến các khóa
            học phần mềm chuyên nghiệp, giúp bạn làm chủ công cụ sáng tạo hiện
            đại trong thiết kế, dựng phim, hoạt hình và mô phỏng 3D. Các khóa
            học phù hợp cho người mới bắt đầu hoặc những ai muốn nâng cao kỹ
            năng phục vụ công việc và đam mê sáng tạo.
          </p>

          <h3 className="training-software__subtitle">
            Lợi ích khi tham gia khóa học:
          </h3>
          <ul className="training-software__benefits">
            {benefitList.map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="training-software__right">
          <div className="training-software__image-wrapper">
            <img
              src={softwareImg}
              alt="Khóa học phần mềm"
              className="training-software__image"
            />
          </div>
        </div>
      </div>

      {/* Phần riêng Danh sách phần mềm chia 2 cột */}
      <section className="software-list-section">
        <h2 className="software-list-section__title">
          Danh sách phần mềm đào tạo:
        </h2>
        <ul className="software-list-section__list">
          {softwareList.map((software, idx) => (
            <li key={idx}>{software}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default TrainingSoftwarePage;
