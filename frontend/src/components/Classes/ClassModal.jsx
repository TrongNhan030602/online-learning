import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import ClassForm from "./ClassForm";

const ClassModal = ({ show, handleClose, initialData, onSuccess, courses }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="class-form__title">
          {initialData ? "Chỉnh sửa lớp học" : "Thêm lớp học mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ClassForm
          initialData={initialData}
          onSuccess={() => {
            onSuccess();
            handleClose();
          }}
          onCancel={handleClose}
          courses={courses}
        />
      </Modal.Body>
    </Modal>
  );
};

ClassModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  courses: PropTypes.array.isRequired,
};

export default ClassModal;
