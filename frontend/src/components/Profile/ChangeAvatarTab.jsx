import "../../styles/profile/change-avatar.css";
import { useState } from "react";
import PropTypes from "prop-types";

const ChangeAvatarTab = ({ onChange }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
    onChange(event);
  };

  return (
    <div className="change-avatar">
      <h3 className="change-avatar__title">Đổi Hình Đại Diện</h3>
      <div className="change-avatar__preview">
        {preview ? (
          <img
            src={preview}
            alt="Avatar Preview"
            className="change-avatar__preview-image"
          />
        ) : (
          <i className="change-avatar__preview-icon fas fa-camera"></i>
        )}
      </div>
      <label
        htmlFor="avatar-upload"
        className="change-avatar__upload-label"
      >
        <i className="fas fa-upload"></i> Chọn ảnh
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="change-avatar__upload-input"
      />
    </div>
  );
};
ChangeAvatarTab.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ChangeAvatarTab;
