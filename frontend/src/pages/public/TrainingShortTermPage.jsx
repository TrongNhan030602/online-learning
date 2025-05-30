import "../../styles/landing/training-page/training-detail-short-term.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
const certificateList = [
  "Kỹ thuật nhiếp ảnh & chỉnh sửa ảnh căn bản",
  "Kỹ thuật ghi hình",
  "Ứng dụng AI trong Thiết Kế",
  "Thiết kế đồ họa quảng cáo",
  "Thiết kế đồ họa 3D",
  "Dựng phim cơ bản",
  "Thiết kế UX/UI",
  "Hoạt hình 2D",
  "Sản xuất phim quảng cáo",
  "Kịch bản truyền thông",
  "Biên kịch cơ bản",
  "Biên tập báo chí",
  "Phát thanh viên & MC",
  "Đạo diễn truyền hình",
  "Nghiệp vụ báo chí",
  "Đồ họa truyền hình",
  "Đồ họa kiến trúc nội thất",
  "Hoạt hình 3D",
  "Thiết kế & phát triển môi trường 3D trong game",
  "Kỹ xảo phim ảnh",
];

const TrainingShortTermPage = () => {
  return (
    <div className="short-term">
      <section className="short-term__header">
        <h1 className="short-term__title">
          {" "}
          <FontAwesomeIcon
            icon={faStopwatch}
            className="me-2"
          />
          CHỨNG CHỈ
        </h1>
        <p className="short-term__intro">
          Với mục tiêu đào tạo toàn diện và thực tiễn, các chương trình cấp
          chứng chỉ tại <strong>[Tên Trung Tâm]</strong> được thiết kế đa dạng,
          phù hợp với nhiều đối tượng học viên. Mỗi khóa học mang đến kiến thức
          nền tảng, kỹ năng chuyên môn và trải nghiệm thực tế trong các lĩnh vực
          sáng tạo và truyền thông.
        </p>
      </section>

      <section className="short-term__certificates">
        <h2 className="short-term__subtitle">📚 Danh mục chứng chỉ:</h2>
        <div className="short-term__grid">
          {certificateList.map((item, index) => (
            <div
              key={index}
              className="short-term__card"
            >
              <span className="short-term__index">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}.
              </span>
              <span className="short-term__name">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="short-term__features">
        <h2 className="short-term__subtitle">🌟 Đặc điểm nổi bật:</h2>
        <ul className="short-term__benefits">
          <li>Học từ giảng viên có kinh nghiệm thực tiễn</li>
          <li>Tích hợp lý thuyết & thực hành</li>
          <li>Cấp chứng chỉ uy tín, giá trị trong ngành</li>
          <li>Kết nối cộng đồng sáng tạo và cơ hội nghề nghiệp</li>
        </ul>
      </section>

      <section className="short-term__conclusion">
        <p className="short-term__cta">
          🎯 Hãy để <strong>Design24</strong> đồng hành cùng bạn trên hành trình
          phát triển sự nghiệp trong thế giới sáng tạo – nơi bạn khai phá tiềm
          năng và mở rộng tương lai!
        </p>
      </section>
    </div>
  );
};

export default TrainingShortTermPage;
