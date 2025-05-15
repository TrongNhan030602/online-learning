import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faBriefcase,
  faVenusMars,
  faIdBadge,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/profile/profile-tab.css";

const ProfileTab = ({ profile }) => {
  if (!profile) return <p className="loading">Đang tải hồ sơ...</p>;

  return (
    <div className="profile-tab">
      <h3 className="profile-tab__title">Hồ Sơ Cá Nhân</h3>
      <div className="profile-tab__info">
        <div className="profile-tab__item">
          <FontAwesomeIcon
            icon={faUser}
            className="profile-tab__icon"
          />
          <span>Họ và tên:</span>
          <strong>
            {profile?.first_name} {profile?.last_name}
          </strong>
        </div>

        <div className="profile-tab__item">
          <FontAwesomeIcon
            icon={faIdBadge}
            className="profile-tab__icon"
          />
          <span>Tên đăng nhập:</span>
          <strong>{profile?.username}</strong>
        </div>

        <div className="profile-tab__item">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="profile-tab__icon"
          />
          <span>Email:</span>
          <strong>{profile?.email}</strong>
        </div>

        <div className="profile-tab__item">
          <FontAwesomeIcon
            icon={faPhone}
            className="profile-tab__icon"
          />
          <span>Số điện thoại:</span>
          <strong>{profile?.phone}</strong>
        </div>

        <div className="profile-tab__item">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="profile-tab__icon"
          />
          <span>Địa chỉ:</span>
          <strong>{profile?.address}</strong>
        </div>

        <div className="profile-tab__item">
          <FontAwesomeIcon
            icon={faVenusMars}
            className="profile-tab__icon"
          />
          <span>Giới tính:</span>
          <strong>{profile?.gender}</strong>
        </div>

        <div className="profile-tab__item">
          <FontAwesomeIcon
            icon={faBriefcase}
            className="profile-tab__icon"
          />
          <span>Chức vụ:</span>
          <strong>{profile?.position}</strong>
        </div>

        <div className="profile-tab__item profile-tab__item--full">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="profile-tab__icon"
          />
          <span>Giới thiệu bản thân:</span>
          <p>{profile?.info}</p>
        </div>
      </div>
    </div>
  );
};

ProfileTab.propTypes = {
  profile: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    gender: PropTypes.string,
    position: PropTypes.string,
    info: PropTypes.string,
  }),
};

export default ProfileTab;
