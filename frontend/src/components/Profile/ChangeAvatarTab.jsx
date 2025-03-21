import { useState } from "react";

const ChangeAvatarTab = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    console.log("Tải lên avatar:", selectedFile);
  };

  return (
    <div className="profile-tab">
      <h3>Đổi ảnh đại diện</h3>
      <div className="file-drop-container">
        <input
          type="file"
          id="avatarUpload"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label
          htmlFor="avatarUpload"
          className="drop-zone"
        >
          {selectedFile ? selectedFile.name : "Kéo thả hoặc chọn ảnh"}
        </label>
      </div>
      <button
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        Cập nhật Avatar
      </button>
    </div>
  );
};

export default ChangeAvatarTab;
