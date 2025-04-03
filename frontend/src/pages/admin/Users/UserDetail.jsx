import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import userApi from "../../../api/userApi";
import "../../../styles/user/user-detail.css";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await userApi.getUserDetail(id);
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  if (loading) return <div className="user-detail__loading">Đang tải...</div>;

  if (!user)
    return <div className="user-detail__error">Không tìm thấy người dùng</div>;

  // Hàm để chuyển đổi ngày tháng (hiển thị ngày theo định dạng Việt Nam)
  const formatDateTime = (date) => {
    const dateObj = new Date(date);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return dateObj.toLocaleDateString("vi-VN", options); // Định dạng ngày tháng theo kiểu Việt Nam
  };

  // Hàm để hiển thị giờ (start_time và end_time)
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`; // Trả về thời gian theo định dạng "HH:MM"
  };

  return (
    <div className="container user-detail">
      <div className="user-detail__header">
        <h2 className="user-detail__title">Chi tiết Người dùng</h2>
        <Link
          to="/admin/users"
          className="user-detail__back"
        >
          ← Danh sách người dùng
        </Link>
      </div>

      {/* Thông tin chung */}
      <div className="card user-detail__card">
        <div className="card-body">
          <p>
            <strong>Tài khoản:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Vai trò:</strong> {user.role}
          </p>
        </div>
      </div>

      {/* Thông tin hồ sơ */}
      {user.profile && (
        <div className="card user-detail__card">
          <div className="card-body">
            <h4>Hồ sơ người dùng</h4>
            <p>
              <strong>Họ & Tên:</strong> {user.profile.first_name}{" "}
              {user.profile.last_name}
            </p>
            <p>
              <strong>Điện thoại:</strong> {user.profile.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {user.profile.address}
            </p>
            <p>
              <strong>Giới tính:</strong> {user.profile.gender}
            </p>
            <p>
              <strong>Vị trí:</strong> {user.profile.position}
            </p>
            <p>
              <strong>Thông tin:</strong> {user.profile.info}
            </p>
          </div>
        </div>
      )}

      {/* Danh sách lớp học đã ghi danh */}
      {user.enrollments?.length > 0 && (
        <div className="card user-detail__card">
          <div className="card-body">
            <h4>Danh sách lớp học</h4>
            {user.enrollments.map((enrollment, index) => (
              <div
                key={enrollment.id}
                className="user-detail__class"
              >
                <h5>
                  {index + 1}. {enrollment.classroom.name}
                </h5>
                <p>
                  <strong>Khóa học:</strong> {enrollment.classroom.course.title}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span className={`status-${enrollment.status}`}>
                    {enrollment.status === "approved"
                      ? "✅ Đã ghi danh"
                      : enrollment.status}
                  </span>
                </p>

                {/* Danh sách buổi học */}
                {enrollment.classroom.sessions?.length > 0 && (
                  <div>
                    <strong>Lịch học:</strong>
                    <ul className="user-detail__sessions">
                      {enrollment.classroom.sessions.map((session) => (
                        <li
                          key={session.id}
                          className="user-detail__session"
                        >
                          <strong>{session.title}</strong> :{" "}
                          {formatDateTime(session.session_date)} -{" "}
                          <strong>
                            {formatTime(session.start_time)} -{" "}
                            {formatTime(session.end_time)}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
