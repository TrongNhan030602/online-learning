import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import CouponForm from "./CouponForm";

const CouponModal = ({ show, handleClose, initialData, onSuccess }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="coupon-form__title">
          {initialData ? "Chỉnh sửa Mã Giảm Giá" : "Thêm Mã Giảm Giá Mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CouponForm
          initialData={initialData}
          onSuccess={onSuccess}
          onClose={handleClose}
        />
      </Modal.Body>
    </Modal>
  );
};

CouponModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default CouponModal;
