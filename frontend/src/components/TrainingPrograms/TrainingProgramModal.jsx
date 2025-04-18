import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import TrainingProgramForm from "./TrainingProgramForm";

const TrainingProgramModal = ({
  show,
  handleClose,
  initialData,
  onSuccess,
  courses,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="training-program-form__title">
          {initialData
            ? "Chỉnh sửa chương trình đào tạo"
            : "Thêm chương trình đào tạo mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TrainingProgramForm
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

TrainingProgramModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  courses: PropTypes.array.isRequired,
};

export default TrainingProgramModal;
