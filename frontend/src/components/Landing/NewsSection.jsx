import { useState, useEffect } from "react";
import "../../styles/landing/news-section.css";
// Tin về học viện
import ttvhv01 from "../../assets/img/landing/tin-tuc-ve-hoc-vien-01.webp";
import ttvhv02 from "../../assets/img/landing/tin-tuc-ve-hoc-vien-02.webp";
import ttvhv03 from "../../assets/img/landing/tin-tuc-ve-hoc-vien-03.webp";
import ttvhv04 from "../../assets/img/landing/tin-tuc-ve-hoc-vien-04.webp";
import ttvhv05 from "../../assets/img/landing/tin-tuc-ve-hoc-vien-05.webp";
import ttvhv06 from "../../assets/img/landing/tin-tuc-ve-hoc-vien-06.webp";
import ttvhv07 from "../../assets/img/landing/tin-tuc-ve-hoc-vien-07.webp";
import ttvhv08 from "../../assets/img/landing/tin-tuc-ve-hoc-vien-08.webp";
// Tin về ngành
import ttvn01 from "../../assets/img/landing/tin-tuc-ve-nganh-01.webp";
import ttvn02 from "../../assets/img/landing/tin-tuc-ve-nganh-02.webp";
import ttvn03 from "../../assets/img/landing/tin-tuc-ve-nganh-03.webp";
import ttvn04 from "../../assets/img/landing/tin-tuc-ve-nganh-04.webp";
import ttvn05 from "../../assets/img/landing/tin-tuc-ve-nganh-05.webp";
import ttvn06 from "../../assets/img/landing/tin-tuc-ve-nganh-06.webp";
import ttvn07 from "../../assets/img/landing/tin-tuc-ve-nganh-07.webp";
import ttvn08 from "../../assets/img/landing/tin-tuc-ve-nganh-08.webp";

const academyNews = [
  {
    title: "Design24 khai giảng khóa học Motion Graphics mới",
    date: "20/05/2025",
    image: ttvhv01,
  },
  {
    title: "Design24 thông báo tuyển sinh 05/2025",
    date: "30/05/2025",
    image: ttvhv08,
  },
  {
    title: "Không gian giới thiệu sản phẩm du lịch",
    date: "15/02/2025",
    image: ttvhv04,
  },
  {
    title: "Design24 và Khoa kinh tế đại học Nam Cần Thơ",
    date: "28/01/2025",
    image: ttvhv05,
  },
  {
    title: "Lịch khai giảng các chương trình đào tạo 2025",
    date: "10/04/2025",
    image: ttvhv02,
  },
  {
    title: "Ra mắt khóa ngắn hạn về thiết kế và dựng phim",
    date: "05/03/2025",
    image: ttvhv03,
  },

  {
    title: "Ra mắt khóa học Đồ họa chuyên nghành",
    date: "18/12/2024",
    image: ttvhv06,
  },
  {
    title: "Ra mắt khóa chuyên nghiệp về thiết kế đồ họa và video maketing",
    date: "05/11/2024",
    image: ttvhv07,
  },
];

const industryNews = [
  {
    title: "Xu hướng thiết kế đồ họa năm 2025",
    date: "15/05/2025",
    image: ttvn01,
  },
  {
    title: "Ứng dụng AI và và Đồ họa thực tế ảo  vào sản xuất truyền hình",
    date: "07/03/2025",
    image: ttvn02,
  },
  {
    title: "TVC quảng cáo: Từ sáng tạo đến thực thi chuyên nghiệp",
    date: "18/03/2025",
    image: ttvn03,
  },
  {
    title: "Motion Graphic: Nghề hot giữa thời đại số",
    date: "01/02/2025",
    image: ttvn04,
  },
  {
    title: "Bí quyết làm portfolio chinh phục nhà tuyển dụng",
    date: "22/01/2025",
    image: ttvn05,
  },
  {
    title: "Top 03 xu thế làm video ngắn 2024",
    date: "03/12/2024",
    image: ttvn06,
  },
  {
    title: "Sáng tạo trong quảng cáo: Từ ý tưởng đến viral",
    date: "15/11/2024",
    image: ttvn07,
  },
  {
    title: "Thiết kế trải nghiệm người dùng ngày càng được chú trọng",
    date: "25/10/2024",
    image: ttvn08,
  },
];

const NewsSection = () => {
  const [showAllAcademy, setShowAllAcademy] = useState(false);
  const [showAllIndustry, setShowAllIndustry] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      setVisibleCount(width <= 800 ? 2 : 4); // mobile: 2, desktop: 4
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  return (
    <section className="news">
      <div className="news__container">
        <h2 className="news__title">Tin tức</h2>

        <div className="news__block">
          <h3 className="news__subtitle">Tin về học viện Design24</h3>
          <div className="news__grid">
            {(showAllAcademy
              ? academyNews
              : academyNews.slice(0, visibleCount)
            ).map((item, i) => (
              <div
                className="news__card"
                key={i}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="news__image"
                />
                <div className="news__info">
                  <p className="news__date">{item.date}</p>
                  <p className="news__text">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="news__more">
            <button
              className="news__link"
              onClick={() => setShowAllAcademy(!showAllAcademy)}
            >
              {showAllAcademy ? "Ẩn bớt" : "Xem thêm"}
            </button>
          </div>
        </div>

        <div className="news__block">
          <h3 className="news__subtitle">Tin về ngành</h3>
          <div className="news__grid">
            {(showAllIndustry
              ? industryNews
              : industryNews.slice(0, visibleCount)
            ).map((item, i) => (
              <div
                className="news__card"
                key={i}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="news__image"
                />
                <div className="news__info">
                  <p className="news__date">{item.date}</p>
                  <p className="news__text">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="news__more">
            <button
              className="news__link"
              onClick={() => setShowAllIndustry(!showAllIndustry)}
            >
              {showAllIndustry ? "Ẩn bớt" : "Xem thêm"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
