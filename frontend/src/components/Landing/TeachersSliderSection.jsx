import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/landing/teachers-slider-section.css";

const teachers = [
  {
    id: 1,
    name: "Nghiêm Quốc Anh",
    title: "Thiết kế đồ họa & In ấn",
    photo:
      "https://maac.edu.vn/wp-content/uploads/2023/12/thay-nghiem-quoc-anh.jpg",
    bio: "Hơn 12 năm kinh nghiệm trong thiết kế ấn phẩm truyền thông và định hướng thương hiệu cho doanh nghiệp lớn.",
  },
  {
    id: 2,
    name: "Đình Hoàng Long",
    title: "Hoạt hình & 3D Modeling",
    photo:
      "https://maac.edu.vn/wp-content/uploads/2023/12/thay-dinh-hoang-long.jpg",
    bio: "Chuyên gia hoạt hình nhân vật với kinh nghiệm làm việc tại các studio trong và ngoài nước.",
  },
  {
    id: 3,
    name: "Hoàng Đức Phúc",
    title: "UI/UX Design",
    photo:
      "https://maac.edu.vn/wp-content/uploads/2023/12/thay-hoang-duc-phuc.jpg",
    bio: "Từng là trưởng nhóm thiết kế tại startup công nghệ, anh tập trung phát triển trải nghiệm người dùng hiện đại và tối ưu.",
  },
  {
    id: 4,
    name: "Nguyễn Thị Trà Giang",
    title: "Motion Graphics",
    photo:
      "https://maac.edu.vn/wp-content/uploads/2021/11/Co-Tra-Giang-MAACVN.jpg",
    bio: "Kỹ thuật viên hậu kỳ với hơn 9 năm kinh nghiệm làm motion cho TVC, video sự kiện và quảng cáo.",
  },
  {
    id: 5,
    name: "Võ Huy Giáp",
    title: "Branding & Visual Identity",
    photo: "https://maac.edu.vn/wp-content/uploads/2023/12/Giangvien_16A.jpg",
    bio: "Đã tham gia xây dựng bộ nhận diện thương hiệu cho hơn 50 doanh nghiệp trong nhiều lĩnh vực.",
  },
  {
    id: 6,
    name: "Bùi Thanh Vinh",
    title: "Video Editing & Color Grading",
    photo:
      "https://maac.edu.vn/wp-content/uploads/2023/12/thay-bui-thanh-vinh.jpg",
    bio: "Chuyên viên dựng phim chuyên nghiệp, từng làm việc tại các hãng phim và kênh truyền hình lớn.",
  },
  {
    id: 7,
    name: "Trần Nam Duy",
    title: "Thiết kế Web & Responsive UI",
    photo:
      "https://maac.edu.vn/wp-content/uploads/2023/12/thay-tran-nam-duy.jpg",
    bio: "Giảng viên lập trình front-end với nền tảng vững chắc về HTML5, CSS3, JavaScript và UI frameworks.",
  },
  {
    id: 8,
    name: "Nguyễn Phương Tâm",
    title: "Digital Painting & Concept Art",
    photo:
      "https://maac.edu.vn/wp-content/uploads/2023/12/thay-nguyen-phuong-tam.jpg",
    bio: "Họa sĩ minh họa từng làm việc cho nhiều game studio và dự án truyện tranh kỹ thuật số.",
  },
  {
    id: 9,
    name: "Lý Phượng Yến",
    title: "Thiết kế giao diện App",
    photo:
      "https://maac.edu.vn/wp-content/uploads/2021/11/Co-Ly-Phuong-Yen-MAACVN.jpg",
    bio: "Tập trung vào thiết kế giao diện di động tối ưu trải nghiệm người dùng và hướng dẫn sinh viên thực chiến với dự án thực tế.",
  },
];

const TeachersSliderSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="teachers-slider">
      <h2 className="teachers-slider__title">Giảng Viên Design24</h2>
      <p className="teachers-slider__description">
        Đội ngũ giảng viên tận tâm với nhiều năm kinh nghiệm thực chiến trong
        ngành sáng tạo, mang đến trải nghiệm học tập thực tế và truyền cảm hứng
        cho học viên.
      </p>

      <Slider
        {...settings}
        className="teachers-slider__slider"
      >
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="teachers-slider__slide"
          >
            <div className="teachers-slider__card">
              <img
                src={teacher.photo}
                alt={teacher.name}
                className="teachers-slider__img"
              />
              <div className="teachers-slider__overlay">
                <h3 className="teachers-slider__name">{teacher.name}</h3>
                <p className="teachers-slider__title-text">{teacher.title}</p>
                <p className="teachers-slider__bio">{teacher.bio}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default TeachersSliderSection;
