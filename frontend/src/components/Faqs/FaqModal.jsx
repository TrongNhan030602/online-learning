import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import FaqForm from "./FaqForm";

const FaqModal = ({ show, handleClose, initialData, onSuccess }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="faq-form__title">
          {initialData ? "Chỉnh sửa FAQ" : "Thêm Câu Hỏi Mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FaqForm
          initialData={initialData}
          onSuccess={() => {
            onSuccess(); // Đảm bảo rằng callback `onSuccess` được gọi
            handleClose(); // Đóng modal khi thành công
          }}
          onCancel={handleClose}
        />
      </Modal.Body>
    </Modal>
  );
};

FaqModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default FaqModal;
