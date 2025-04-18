// StudentProfile.jsx
import { useState } from "react";
import "../../styles/student/student-profile.css";
const StudentProfile = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  const handleSave = () => {
    alert("Thông tin đã được lưu!");
  };

  return (
    <div className="student-profile">
      <h1>Hồ sơ cá nhân</h1>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="name">Họ và tên</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ và tên"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default StudentProfile;
