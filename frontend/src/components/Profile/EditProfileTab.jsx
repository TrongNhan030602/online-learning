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
      <h3 className="edit-profile__title">Sửa Hồ Sơ</h3>
      <form
        className="edit-profile__form"
        onSubmit={handleSubmit}
      >
        {[
          { name: "first_name", label: "Họ", icon: faUser },
          { name: "last_name", label: "Tên", icon: faUser },
          { name: "phone", label: "Số điện thoại", icon: faPhone },
          { name: "address", label: "Địa chỉ", icon: faMapMarkerAlt },
          { name: "position", label: "Chức vụ", icon: faBriefcase },
        ].map(({ name, label, icon }) => (
          <div
            className="edit-profile__group"
            key={name}
          >
            <label className="edit-profile__label">{label}</label>
            <div className="edit-profile__input-wrapper">
              <FontAwesomeIcon
                icon={icon}
                className="edit-profile__icon"
              />
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
            </div>
          </div>
        ))}

        {/* Giới tính */}
        <div className="edit-profile__group">
          <label className="edit-profile__label">Giới tính</label>
          <div className="edit-profile__input-wrapper">
            <FontAwesomeIcon
              icon={faVenusMars}
              className="edit-profile__icon"
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

        {/* Giới thiệu */}
        <div className="edit-profile__group edit-profile__group--full">
          <label className="edit-profile__label">Giới thiệu</label>
          <div className="edit-profile__input-wrapper">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="edit-profile__icon"
            />
            <textarea
              name="info"
              value={formData.info}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
        </div>

        {/* Nút Lưu */}
        <button
          type="submit"
          className="edit-profile__button"
        >
          Lưu thay đổi
        </button>
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
