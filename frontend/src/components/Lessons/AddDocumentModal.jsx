import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Cài đặt react-bootstrap nếu chưa có
import PropTypes from "prop-types";
import lessonApi from "../../api/lessonApi"; // API để thêm tài liệu

const AddDocumentModal = ({ show, handleClose, lessonId, onDocumentAdded }) => {
  const [files, setFiles] = useState([]); // Sử dụng files thay vì file đơn

  const handleFileChange = (event) => {
    setFiles(event.target.files); // Lưu các tệp được chọn vào state
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (files.length === 0) {
      alert("Vui lòng chọn ít nhất một tài liệu.");
      return;
    }

    const formData = new FormData();

    // Thêm tất cả các tệp vào FormData với key là "documents[]"
    Array.from(files).forEach((file) => {
      formData.append("documents[]", file); // "documents[]" là key mà API yêu cầu
    });

    try {
      await lessonApi.addDocuments(lessonId, formData); // API để thêm tài liệu
      onDocumentAdded(); // Gọi callback sau khi thêm tài liệu thành công
      handleClose(); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi thêm tài liệu:", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Thêm tài liệu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group
            controlId="formFile"
            className="mb-3"
          >
            <Form.Label>Chọn tài liệu</Form.Label>
            <Form.Control
              type="file"
              multiple // Thêm thuộc tính multiple để cho phép chọn nhiều tệp
              onChange={handleFileChange}
            />
          </Form.Group>
          <Button
            className="admin-course-detail__btn-detail"
            type="submit"
          >
            Thêm tài liệu
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddDocumentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  lessonId: PropTypes.string.isRequired,
  onDocumentAdded: PropTypes.func.isRequired,
};

export default AddDocumentModal;
