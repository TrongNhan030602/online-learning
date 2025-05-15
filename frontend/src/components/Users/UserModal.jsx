import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import UserForm from "./UserForm";
import { useToast } from "@/hooks/useToast";

const UserModal = ({ show, handleClose, initialData, onSuccess }) => {
  const { addToast } = useToast();
  const handleSuccess = (data) => {
    addToast({
      title: "Thành công!",
      message: initialData
        ? "Người dùng đã được cập nhật."
        : "Người dùng mới đã được thêm.",
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
      className="user-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="user-modal__title">
          {initialData ? "Chỉnh sửa Người dùng" : "Thêm Người dùng Mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="user-modal__body">
        <UserForm
          initialData={initialData}
          onSuccess={handleSuccess}
          onCancel={handleClose}
        />
      </Modal.Body>
    </Modal>
  );
};

UserModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default UserModal;
