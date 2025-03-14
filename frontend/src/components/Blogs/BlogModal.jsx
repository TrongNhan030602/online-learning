import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import BlogForm from "./BlogForm";
import { useToast } from "../../hooks/useToast";

const BlogModal = ({ show, handleClose, initialData, onSuccess }) => {
  const { addToast } = useToast();

  const handleSuccess = (data) => {
    addToast({
      title: "Thành công!",
      message: initialData
        ? "Blog đã được cập nhật."
        : "Blog mới đã được thêm.",
      type: "success",
      duration: 3000,
    });

    onSuccess(data);
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Chỉnh sửa Blog" : "Thêm Blog Mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BlogForm
          initialData={initialData}
          onSuccess={handleSuccess}
          onCancel={handleClose}
        />
      </Modal.Body>
    </Modal>
  );
};

BlogModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default BlogModal;
