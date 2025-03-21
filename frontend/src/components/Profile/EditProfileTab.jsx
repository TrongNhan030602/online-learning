import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faMapMarkerAlt,
  faBriefcase,
  faInfoCircle,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/profile/edit-profile-tab.css";
import PropTypes from "prop-types";

const EditProfileTab = ({ profile, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    gender: profile?.gender || "",
    position: profile?.position || "",
    info: profile?.info || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="edit-profile">
      <h3>Sửa Hồ Sơ</h3>
      <form onSubmit={handleSubmit}>
        {/* Họ */}
        <div className="form-group">
          <label className="form-label">Họ</label>
          <div className="input-wrapper">
            <FontAwesomeIcon
              icon={faUser}
              className="fa-icon"
            />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Tên */}
        <div className="form-group">
          <label className="form-label">Tên</label>
          <div className="input-wrapper">
            <FontAwesomeIcon
              icon={faUser}
              className="fa-icon"
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Số điện thoại */}
        <div className="form-group">
          <label className="form-label">Số điện thoại</label>
          <div className="input-wrapper">
            <FontAwesomeIcon
              icon={faPhone}
              className="fa-icon"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="form-group">
          <label className="form-label">Địa chỉ</label>
          <div className="input-wrapper">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="fa-icon"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Giới tính */}
        <div className="form-group">
          <label className="form-label">Giới tính</label>
          <div className="input-wrapper">
            <FontAwesomeIcon
              icon={faVenusMars}
              className="fa-icon"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>

        {/* Chức vụ */}
        <div className="form-group">
          <label className="form-label">Chức vụ</label>
          <div className="input-wrapper">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="fa-icon"
            />
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Giới thiệu */}
        <div className="form-group full-width">
          <label className="form-label">Giới thiệu</label>
          <div className="input-wrapper">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="fa-icon"
            />
            <textarea
              name="info"
              value={formData.info}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
        </div>

        {/* Nút lưu */}
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};
EditProfileTab.propTypes = {
  profile: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    gender: PropTypes.string,
    position: PropTypes.string,
    info: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default EditProfileTab;
