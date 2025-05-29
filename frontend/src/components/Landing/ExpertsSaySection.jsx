import expert1 from "@/assets/img/landing/chuyen-gia-01.webp";
import expert2 from "@/assets/img/landing/chuyen-gia-02.webp";
import expert3 from "@/assets/img/landing/chuyen-gia-03.webp";
import expert4 from "@/assets/img/landing/chuyen-gia-04.webp";
import expert5 from "@/assets/img/landing/chuyen-gia-05.webp";
import expert6 from "@/assets/img/landing/chuyen-gia-06.webp";
import "../../styles/landing/experts-say-section.css";

const expertsData = [
  {
    name: "TS. Nguyễn Quốc Dũng",
    title: "Giám đốc sáng tạo, Tập đoàn Truyền thông G.A.S",
    quote:
      "Design24 đang đào tạo một thế hệ thiết kế trẻ vừa sáng tạo vừa kỷ luật.",
    avatar: expert1,
  },
  {
    name: "ThS. Lê Thanh Hương",
    title: "Giảng viên Thiết kế Đồ họa, Đại học Kiến trúc TP.HCM",
    quote:
      "Chương trình học tại Design24 rất thực tế và cập nhật theo xu hướng ngành.",
    avatar: expert4,
  },
  {
    name: "Ông Trần Minh Hải",
    title: "Giám đốc Marketing khu vực, Tiki Corporation",
    quote:
      "Tôi ấn tượng với khả năng trình bày và tư duy thiết kế của các bạn học viên.",
    avatar: expert3,
  },
  {
    name: "Ông Nguyễn Hoài Phương",
    title: "Cố vấn cấp cao Truyền thông thị giác, Freelance & Agency",
    quote:
      "Design24 kết hợp hài hòa giữa lý thuyết thiết kế và ứng dụng thực tiễn.",
    avatar: expert5,
  },
  {
    name: "TS. Vũ Ngọc Thạch",
    title: "Trưởng Ban giám khảo, Cuộc thi Thiết kế Trẻ Việt Nam 2024",
    quote:
      "Nhiều học viên của Design24 đã để lại dấu ấn mạnh tại các cuộc thi chuyên môn.",
    avatar: expert6,
  },
  {
    name: "Thầy Lương Hữu Phước",
    title: "Giảng viên Thiết kế đồ họa, Khoa Mỹ thuật Ứng dụng – ĐH Văn Lang",
    quote:
      "Design24 xây dựng lộ trình học tập rõ ràng và truyền cảm hứng rất tốt.",
    avatar: expert2,
  },
];

const ExpertsSaySection = () => {
  return (
    <section className="experts">
      <div className="experts__container">
        <h2 className="experts__title">Các chuyên gia nói gì về Design24</h2>
        <div className="experts__cards">
          {expertsData.map((expert, index) => (
            <div
              className="experts__card"
              key={index}
            >
              <div className="experts__info">
                <p className="experts__info-quote">“{expert.quote}”</p>
                <p className="experts__info-name">{expert.name}</p>
                <p className="experts__info-title">{expert.title}</p>
              </div>
              <img
                src={expert.avatar}
                alt={expert.name}
                className="experts__avatar"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertsSaySection;
