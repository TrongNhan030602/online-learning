// src/components/Lessons/LessonFilesModal.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import courseFileApi from "../../api/courseFileApi";
import lessonApi from "../../api/lessonApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStorageUrl } from "../../utils/getStorageUrl";
import {
  faFilePdf,
  faFileImage,
  faFileVideo,
  faFileAlt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/course/lesson-files-modal.css";

const LessonFilesModal = ({
  show,
  handleClose,
  lessonId,
  courseId,
  onSuccess,
  initialSelectedFileIds, // Mảng ID các file đã được gán trước
}) => {
  const [courseFiles, setCourseFiles] = useState([]);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [error, setError] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Khi modal mở ra, set các file đã được gán sẵn (nếu có)
  useEffect(() => {
    if (show) {
      setSelectedFileIds(initialSelectedFileIds || []);
      setError("");
      setSuccessMessage("");
    }
  }, [show, initialSelectedFileIds]);

  // Lấy danh sách file của khóa học dựa vào courseId
  useEffect(() => {
    if (!courseId) return;
    setLoadingFiles(true);
    courseFileApi
      .getFiles(courseId)
      .then((res) => {
        setCourseFiles(res.data);
        setLoadingFiles(false);
      })
      .catch((err) => {
        console.error(
          "Lỗi khi lấy danh sách file khóa học:",
          err.response?.data
        );
        setLoadingFiles(false);
      });
  }, [lessonId, courseId]);

  const handleCheckboxChange = (e) => {
    const fileId = parseInt(e.target.value, 10);
    if (e.target.checked) {
      setSelectedFileIds((prev) => [...prev, fileId]);
    } else {
      setSelectedFileIds((prev) => prev.filter((id) => id !== fileId));
    }
  };

  // Hàm lấy tên file từ đường dẫn (ví dụ: "course_images/php-1741425580.jpg" -> "php-1741425580.jpg")
  const getFileName = (filePath) => filePath.split("/").pop();

  const getIconForFile = (file) => {
    if (file.type === "image") {
      return faFileImage;
    } else if (file.type === "document") {
      if (file.file_path.toLowerCase().endsWith(".pdf")) {
        return faFilePdf;
      } else if (
        file.file_path.toLowerCase().endsWith(".mp4") ||
        file.file_path.toLowerCase().endsWith(".avi") ||
        file.file_path.toLowerCase().endsWith(".mov")
      ) {
        return faFileVideo;
      } else {
        return faFileAlt;
      }
    }
    return faFileAlt;
  };

  const handleSubmit = () => {
    if (selectedFileIds.length === 0) {
      setError("Vui lòng chọn ít nhất một tài liệu.");
      return;
    }
    lessonApi
      .assignFiles(lessonId, selectedFileIds)
      .then(() => {
        setSuccessMessage("Chọn tài liệu thành công!");
        // Sau 1 giây, gọi onSuccess và đóng modal
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Chọn tài liệu thất bại.");
      });
  };

  if (!show) return null;

  return (
    <div className="lesson-files-modal__overlay">
      <div className="lesson-files-modal">
        <div className="lesson-files-modal__header">
          <h3 className="lesson-files-modal__title">
            Chọn tài liệu cho bài học
          </h3>
          <button
            className="lesson-files-modal__close"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        <div className="lesson-files-modal__body">
          {error && <p className="lesson-files-modal__error">{error}</p>}
          {successMessage && (
            <p className="lesson-files-modal__success">{successMessage}</p>
          )}
          {loadingFiles ? (
            <p className="lesson-files-modal__loading">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
              />{" "}
              Đang tải tài liệu...
            </p>
          ) : courseFiles.length > 0 ? (
            <ul className="lesson-files-modal__list">
              {courseFiles.map((file) => (
                <li
                  key={file.id}
                  className="lesson-files-modal__list-item"
                >
                  <label>
                    <input
                      type="checkbox"
                      value={file.id}
                      onChange={handleCheckboxChange}
                      className="lesson-files-modal__checkbox"
                      checked={selectedFileIds.includes(file.id)}
                    />
                    <FontAwesomeIcon
                      icon={getIconForFile(file)}
                      className="lesson-files-modal__icon"
                    />
                    <span className="lesson-files-modal__file-info">
                      {file.type.toUpperCase()}: {getFileName(file.file_path)}
                    </span>
                    <a
                      href={getStorageUrl(file.file_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="lesson-files-modal__view-link"
                    >
                      Xem
                    </a>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lesson-files-modal__no-data">
              Không có tài liệu nào.
            </p>
          )}
        </div>
        <div className="lesson-files-modal__footer">
          <button
            className="lesson-files-modal__btn lesson-files-modal__btn--primary"
            onClick={handleSubmit}
          >
            Chọn tài liệu
          </button>
          <button
            className="lesson-files-modal__btn lesson-files-modal__btn--secondary"
            onClick={handleClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

LessonFilesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  lessonId: PropTypes.number.isRequired,
  courseId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  initialSelectedFileIds: PropTypes.arrayOf(PropTypes.number),
};

LessonFilesModal.defaultProps = {
  initialSelectedFileIds: [],
};

export default LessonFilesModal;
