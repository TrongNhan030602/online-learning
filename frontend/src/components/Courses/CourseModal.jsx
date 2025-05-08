import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import CourseForm from "./CourseForm";

const CourseModal = ({ show, handleClose, initialData, onSuccess }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData && initialData.id
            ? "Cập nhật môn học"
            : "Thêm môn học mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CourseForm
          initialData={initialData}
          onSuccess={(data) => {
            onSuccess(data);
            handleClose();
          }}
          onCancel={handleClose}
        />
      </Modal.Body>
    </Modal>
  );
};

CourseModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default CourseModal;
