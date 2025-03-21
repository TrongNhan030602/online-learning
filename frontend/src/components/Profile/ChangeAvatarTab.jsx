/* eslint-disable react/prop-types */
import "../../styles/profile/change-avatar.css";
import { useState } from "react";

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
    <div className="change-avatar-container">
      <h3 className="change-avatar-title">Đổi Hình Đại Diện</h3>
      <div className="avatar-preview">
        {preview ? (
          <img
            src={preview}
            alt="Avatar Preview"
          />
        ) : (
          <i className="fas fa-camera avatar-icon"></i>
        )}
      </div>
      <label
        htmlFor="avatar-upload"
        className="avatar-upload-label"
      >
        <i className="fas fa-upload"></i> Chọn ảnh
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="avatar-upload-input"
      />
    </div>
  );
};

export default ChangeAvatarTab;
