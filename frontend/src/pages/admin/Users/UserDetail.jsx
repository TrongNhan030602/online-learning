import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import userApi from "../../../api/userApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import "../../../styles/user/user-detail.css";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await userApi.getUserDetailById(id);
        console.log("Dữ liệu người dùng:", response.data);
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

  const formatDateTime = (date) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day} tháng ${month}, ${year}`;
  };
  const getLevelLabel = (level) => {
    switch (level) {
      case "college":
        return "Cao đẳng";
      case "intermediate":
        return "Trung cấp";
      case "certificate":
        return "Chứng chỉ";
      case "specialized":
        return "Chuyên sâu";
      case "software":
        return "Phần mềm";
      default:
        return level;
    }
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
          <p>
            <strong>Ngày tạo:</strong> {formatDateTime(user.created_at)}
          </p>
          <p>
            <strong>Ngày cập nhật:</strong> {formatDateTime(user.updated_at)}
          </p>
        </div>
      </div>

      {user.profile && (
        <div className="card user-detail__card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="user-detail__info">
                <h4>Hồ sơ người dùng</h4>
                <p>
                  <strong>Họ & Tên:</strong> {user.profile.last_name}{" "}
                  {user.profile.first_name}
                </p>
                <p>
                  <strong>Điện thoại:</strong> {user.profile.phone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {user.profile.address}
                </p>
                <p>
                  <strong>Giới tính:</strong>{" "}
                  {user.profile.gender === "male"
                    ? "Nam"
                    : user.profile.gender === "female"
                    ? "Nữ"
                    : "Khác"}
                </p>

                <p>
                  <strong>Vị trí:</strong> {user.profile.position}
                </p>
                <p>
                  <strong>Thông tin:</strong> {user.profile.info}
                </p>
              </div>
              <div className="user-detail__avatar">
                <img
                  src={getStorageUrl(user.profile.avatar)}
                  alt={`${user.profile.first_name} ${user.profile.last_name}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {user.student_training_programs?.length > 0 && (
        <div className="card user-detail__card">
          <div className="card-body">
            <h4>Danh sách chương trình đào tạo</h4>
            {user.student_training_programs.map((program, index) => (
              <div
                key={program.id}
                className="user-detail__training-program"
              >
                <h5>
                  {index + 1}. {program.training_program.name}
                </h5>
                <p>
                  <strong>Mã chương trình:</strong>{" "}
                  {program.training_program.code}
                </p>
                <p>
                  <strong>Bậc:</strong>{" "}
                  {getLevelLabel(program.training_program.level)}{" "}
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className="tooltip-icon"
                    title="Cấp độ đào tạo: Cao đẳng, trung cấp, chứng chỉ, chuyên sâu, phần mềm"
                  />
                </p>

                <p>
                  <strong>Chú thích:</strong> {program.training_program.note}
                </p>

                {program.discipline_scores.length > 0 && (
                  <div>
                    <h6>Điểm rèn luyện:</h6>
                    <ul>
                      {program.discipline_scores.map((score) => (
                        <li key={score.id}>
                          <strong>{score.semester.name}:</strong> {score.score}{" "}
                          - {score.evaluation}
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
