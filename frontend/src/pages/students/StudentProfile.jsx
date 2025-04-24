import "../../styles/student/student-profile.css";

const StudentProfile = () => {
  return (
    <div className="student-profile">
      <h1>Hồ sơ cá nhân</h1>
      <div className="profile-info">
        <h3>Thông tin cá nhân</h3>
        <p>
          <strong>Họ và tên:</strong> Nguyễn Trọng Nhân
        </p>
        <p>
          <strong>Email:</strong> nguyen.trong.nhan@gmail.com
        </p>
        <p>
          <strong>Niên khóa:</strong> 2023 - 2025
        </p>
        <p>
          <strong>Khóa học:</strong> Cao đẳng thiết kế đồ họa
        </p>
        <p>
          <strong>Chức vụ:</strong> Sinh viên
        </p>
        <p>
          <strong>Ngày sinh:</strong> 13/05/1999
        </p>
        <p>
          <strong>Giới tính:</strong> Nam
        </p>
        <p>
          <strong>Địa chỉ:</strong> Khu vực 4, Phường VII, TP. Vị Thanh, Hậu
          Giang
        </p>
      </div>

      <div className="contact-info">
        <h3>Thông tin liên lạc</h3>
        <p>
          <strong>Di động:</strong> 0909180004
        </p>
        <p>
          <strong>Email cá nhân:</strong> ntnhan@gmail.com
        </p>
        <p>
          <strong>Quốc gia:</strong> Việt Nam
        </p>
        <p>
          <strong>Tỉnh thành:</strong> Hậu Giang
        </p>
        <p>
          <strong>Quận huyện:</strong> TP. Vị Thanh
        </p>
      </div>

      <div className="advisor-info">
        <h3>Thông tin cố vấn học tập</h3>
        <p>
          <strong>Cố vấn học tập:</strong> Giảng viên A
        </p>
        <p>
          <strong>Email cố vấn học tập:</strong> gvA@school.com
        </p>
      </div>
    </div>
  );
};

export default StudentProfile;
