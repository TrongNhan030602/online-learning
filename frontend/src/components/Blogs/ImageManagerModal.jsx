import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import blogApi from "../../api/blogApi";
import { getStorageUrl } from "../../utils/getStorageUrl";
import "../../styles/blog/image-manager-modal.css";

const ImageManagerModal = ({ show, handleClose, blog }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch danh sách ảnh
  const fetchImages = useCallback(async () => {
    if (!blog) return;
    setLoading(true);
    try {
      const response = await blogApi.getImages(blog.id);
      setImages(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ảnh:", error);
    } finally {
      setLoading(false);
    }
  }, [blog]);

  useEffect(() => {
    if (show) {
      fetchImages();
    }
  }, [show, fetchImages]);

  // Xử lý xóa ảnh
  const handleDeleteImage = async (imageId) => {
    try {
      await blogApi.deleteImage(imageId);
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Lỗi khi xóa ảnh:", error);
    }
  };

  // Xử lý upload ảnh ngay khi chọn
  const handleSelectFiles = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length || !blog) return;

    setUploading(true);
    try {
      await blogApi.uploadImages(blog.id, files);
      fetchImages(); // Reload lại danh sách ảnh sau khi upload
    } catch (error) {
      console.error("Lỗi khi tải lên ảnh:", error);
    } finally {
      setUploading(false);
      event.target.value = ""; // Reset input file
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Quản lý ảnh: {blog?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="image-manager">
          {/* Khu vực chọn ảnh */}
          <div className="image-manager__upload">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleSelectFiles}
              className="image-manager__input"
              disabled={uploading}
            />
            <label className="image-manager__upload-label">
              <FontAwesomeIcon icon={faUpload} />{" "}
              {uploading ? "Đang tải lên..." : "Chọn ảnh để tải lên"}
            </label>
          </div>

          {/* Hiển thị trạng thái loading khi đang tải danh sách ảnh */}
          {loading ? (
            <div className="text-center">
              <Spinner
                animation="border"
                variant="primary"
              />
              <p>Đang tải ảnh...</p>
            </div>
          ) : (
            <div className="image-manager__list">
              {images.length > 0 ? (
                images.map((img) => (
                  <div
                    key={img.id}
                    className="image-manager__item"
                  >
                    <img
                      src={getStorageUrl(img.image)}
                      alt="Blog"
                      className="image-manager__img"
                    />
                    <button
                      className="image-manager__delete"
                      onClick={() => handleDeleteImage(img.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="image-manager__empty">Không có ảnh nào.</p>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ImageManagerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  blog: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }),
};

export default ImageManagerModal;
