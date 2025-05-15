import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import gameArtImage from "@/assets/img/landing/landing-slider2.jpg";
import LandingHeader from "@/components/Landing/LandingHeader";
import "../../styles/landing/program-showcase/program-detail.css";

const advertisingDesignProgram = {
  id: "adgad",
  name: "Thiết kế Đồ Hoạ Quảng Cáo",
  fullName: "Chương Trình Đào Tạo Thiết Kế Đồ Hoạ Quảng Cáo",
  image: gameArtImage,
  description: `Chương trình đào tạo Thiết kế Đồ Hoạ Quảng Cáo cung cấp cho học viên kiến thức và kỹ năng chuyên sâu trong việc thiết kế ấn phẩm quảng cáo, xây dựng bộ nhận diện thương hiệu và chiến lược truyền thông tích hợp cho các doanh nghiệp trong ngành quảng cáo và truyền thông.`,
  stages: [
    {
      title: "GIAI ĐOẠN 1: CHỨNG CHỈ NGHỀ",
      duration: "(6 – 12 tháng)",
      objectives: [
        "Trang bị kỹ năng cơ bản để thiết kế ấn phẩm quảng cáo như poster, banner, tờ rơi, brochure...",
      ],
      requirements: "Tốt nghiệp THCS trở lên",
      subjects: [
        "Cơ sở mỹ thuật: hình khối – bố cục – màu sắc",
        "Adobe Photoshop & Illustrator căn bản đến nâng cao",
        "Thiết kế poster, banner, quảng cáo ngoài trời",
        "Thiết kế brochure, catalogue, tờ rơi",
        "Thiết kế hình ảnh mạng xã hội (Facebook/Instagram Ads)",
        "Kỹ năng trình bày ý tưởng thiết kế",
        "Dự án cuối khóa: Bộ ấn phẩm truyền thông cho sản phẩm cụ thể",
      ],
      certification: "Chứng chỉ Nghề Thiết kế Đồ hoạ Quảng cáo",
    },
    {
      title: "GIAI ĐOẠN 2: TRUNG CẤP CHUYÊN NGHIỆP",
      duration: "(2 năm)",
      requirements: "Hoàn thành giai đoạn trước đó hoặc trình độ tương đương",
      objectives: [
        "Nắm vững quy trình thiết kế quảng cáo, xây dựng bộ nhận diện thương hiệu và làm việc chuyên nghiệp với khách hàng",
      ],
      subjects: [
        "Nguyên lý thiết kế quảng cáo – tâm lý người tiêu dùng",
        "Thiết kế hệ thống nhận diện thương hiệu cơ bản",
        "Thiết kế bao bì sản phẩm – nhãn mác – hộp giấy",
        "Dàn trang InDesign: catalogue, báo, tạp chí",
        "Cơ bản về in ấn – chuẩn màu – kỹ thuật chế bản",
        "Dựng mockup – trình bày sản phẩm thực tế",
        "Đồ án tốt nghiệp Trung cấp: Thiết kế bộ nhận diện & chiến dịch quảng cáo cho một sản phẩm thực tế",
      ],
      certification: "Trung cấp chuyên nghiệp Thiết kế Đồ hoạ Quảng cáo",
    },
    {
      title: "GIAI ĐOẠN 3: CAO ĐẲNG",
      duration: "(3 năm)",
      requirements: "Hoàn thành giai đoạn trước đó hoặc trình độ tương đương",

      objectives: [
        "Phát triển năng lực tư duy thương hiệu – sáng tạo nội dung – làm việc với khách hàng, agency hoặc nhóm truyền thông",
      ],
      subjects: [
        "Thiết kế chiến dịch truyền thông tích hợp (IMC)",
        "Visual Thinking – tư duy thị giác trong quảng cáo",
        "Thiết kế hình ảnh cho social media – digital ads",
        "Thiết kế quảng cáo động cơ bản với After Effects",
        "Làm việc theo brief – pitching ý tưởng",
        "Thiết kế portfolio cá nhân – chuẩn hóa quy trình sáng tạo",
        "Đồ án tốt nghiệp Cao đẳng: Thiết kế chiến dịch truyền thông trọn gói cho thương hiệu cụ thể (online & offline)",
      ],
      certification: "Cao đẳng Thiết kế Đồ hoạ Quảng cáo",
    },
    {
      title: "GIAI ĐOẠN 4: ĐẠI HỌC",
      duration: "(4 năm hoặc liên thông 1.5 – 2 năm)",
      objectives: [
        "Trở thành giám đốc sáng tạo – chuyên gia truyền thông thị giác – xây dựng chiến lược thương hiệu và định vị hình ảnh",
      ],
      requirements: "Hoàn thành giai đoạn trước đó hoặc trình độ tương đương",

      subjects: [
        "Phân tích thương hiệu – hành vi người tiêu dùng",
        "Xây dựng chiến lược hình ảnh thương hiệu",
        "Thiết kế quảng cáo tích hợp đa nền tảng (ATL, BTL, Digital)",
        "Kể chuyện bằng hình ảnh – visual storytelling",
        "Định hướng thẩm mỹ & xu hướng sáng tạo quốc tế",
        "Quản lý đội nhóm sáng tạo – quy trình agency thực chiến",
        "Đồ án tốt nghiệp Đại học: Chiến lược thương hiệu và hệ thống truyền thông hình ảnh cho doanh nghiệp",
      ],
      certification: "Cử nhân Thiết kế Đồ hoạ Quảng cáo",
    },
  ],
};

const ProgramDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();

  // default dùng ADGAD nếu không có location.state hoặc không khớp id
  const program =
    location.state || (id === "adgad" ? advertisingDesignProgram : null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!program) return <div>Không tìm thấy chương trình phù hợp.</div>;

  return (
    <div className="program-detail">
      <LandingHeader />

      <div className="program-detail__banner">
        <img
          src={program.image}
          alt={program.name}
        />
        <div className="program-detail__overlay">
          <h1>{program.fullName}</h1>
        </div>
      </div>

      <div className="program-detail__content container">
        <div className="program-detail__description glass-box">
          <p>{program.description}</p>
        </div>

        <div className="program-detail__stage">
          <div className="stage-tabs__buttons-scroll">
            {program.stages.map((stage, index) => (
              <button
                key={index}
                className={`stage-tabs__button ${
                  activeIndex === index ? "stage-tabs__button--active" : ""
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {stage.title}
              </button>
            ))}
          </div>

          <div className="stage-tabs__content glass-box animate-fade">
            <h3 className="stage-tabs__title">
              {program.stages[activeIndex].title}{" "}
              {program.stages[activeIndex].duration}
            </h3>
            <ul className="stage-tabs__list">
              {program.stages[activeIndex].subjects.map((subj, i) => (
                <li
                  key={i}
                  className="stage-tabs__item"
                >
                  {subj}
                </li>
              ))}
            </ul>
            <p>
              <strong>Mục tiêu:</strong>{" "}
              {program.stages[activeIndex].objectives.join(", ")}
            </p>
            <p>
              <strong>Đầu vào:</strong>{" "}
              {program.stages[activeIndex].requirements}
            </p>
            <p>
              <strong>Bằng cấp nhận được:</strong>{" "}
              {program.stages[activeIndex].certification}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage;
