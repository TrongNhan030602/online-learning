import { useEffect, useState } from "react";
import recruitmentImg1 from "@/assets/img/landing/tuyen-dung-01.webp";
import recruitmentImg2 from "@/assets/img/landing/tuyen-dung-02.webp";
import recruitmentImg3 from "@/assets/img/landing/tuyen-dung-03.webp";
import recruitmentImg4 from "@/assets/img/landing/tuyen-dung-04.webp";
import recruitmentImg5 from "@/assets/img/landing/tuyen-dung-05.webp";
import recruitmentImg6 from "@/assets/img/landing/tuyen-dung-06.webp";
import "../../styles/landing/recruitment-section.css";

const recruitmentData = [
  {
    id: 1,
    image: recruitmentImg1,
    date: "27/05/2025",
    description:
      "Design24 tuyển dụng Graphic Designer làm việc full-time tại Cần Thơ.",
  },
  {
    id: 2,
    image: recruitmentImg2,
    date: "18/05/2025",
    description: "Tuyển Trợ giảng Thiết kế đồ họa cho các lớp cuối tuần.",
  },
  {
    id: 3,
    image: recruitmentImg3,
    date: "10/05/2025",
    description:
      "Cơ hội thực tập với vai trò là Designer cho sinh viên năm cuối.",
  },
  {
    id: 4,
    image: recruitmentImg4,
    date: "01/05/2025",
    description:
      "Design24 mở đơn tuyển Cộng tác viên viết nội dung mảng thiết kế.",
  },
  {
    id: 5,
    image: recruitmentImg5,
    date: "22/04/2025",
    description:
      "Tuyển Giảng viên dạy Adobe Illustrator có kinh nghiệm thực tế.",
  },
  {
    id: 6,
    image: recruitmentImg6,
    date: "15/04/2025",
    description:
      "Vị trí Nhân viên Marketing ngành thiết kế sáng tạo đang chờ bạn.",
  },
];

const RecruitmentSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setVisibleCount(2);
      } else if (width <= 1024) {
        setVisibleCount(4);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount(); // Run on mount
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const visibleItems = showAll
    ? recruitmentData
    : recruitmentData.slice(0, visibleCount);

  return (
    <section className="recruitment">
      <div className="recruitment__container">
        <h2 className="recruitment__title">Tin tuyển dụng</h2>
        <div className="recruitment__cards">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="recruitment__card"
            >
              <img
                src={item.image}
                alt={item.description}
                className="recruitment__img"
              />
              <div className="recruitment__info">
                <p className="recruitment__date">{item.date}</p>
                <p className="recruitment__desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="recruitment__more">
          <button
            className="recruitment__link"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Ẩn bớt" : "Xem thêm"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecruitmentSection;
