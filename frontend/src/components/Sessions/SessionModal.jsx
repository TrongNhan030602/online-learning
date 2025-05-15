import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import sessionApi from "@/api/sessionApi";
import { useToast } from "@/hooks/useToast";

const SessionModal = ({
  show,
  handleClose,
  courseId,
  sessionToEdit,
  onSessionAdded,
  onSessionUpdated,
}) => {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef();

  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  useEffect(() => {
    if (sessionToEdit) {
      setSessionData({
        title: sessionToEdit.title || "",
        description: sessionToEdit.description || "",
        startTime: sessionToEdit.start_time?.slice(0, 16) || "",
        endTime: sessionToEdit.end_time?.slice(0, 16) || "",
        location: sessionToEdit.location || "",
      });
    } else {
      setSessionData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
      });
    }
  }, [sessionToEdit, show]);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const sessionPayload = {
      course_id: courseId,
      title: sessionData.title,
      description: sessionData.description,
      start_time: sessionData.startTime,
      end_time: sessionData.endTime,
      location: sessionData.location,
    };

    try {
      if (sessionToEdit) {
        await sessionApi.update(sessionToEdit.id, sessionPayload);
        onSessionUpdated?.();
      } else {
        await sessionApi.createSession(sessionPayload);
        onSessionAdded?.();
      }
      handleClose();
      addToast({
        title: "Thành công!",
        message: "Buổi học đã được lưu",
        type: "success",
        duration: 1500,
      });
    } catch (err) {
      console.error(err);
      alert(sessionToEdit ? "Cập nhật thất bại" : "Thêm buổi học thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { label: "Tiêu đề", name: "title", type: "text", required: true },
    { label: "Mô tả", name: "description", type: "textarea" },
    {
      label: "Thời gian bắt đầu",
      name: "startTime",
      type: "datetime-local",
      required: true,
    },
    {
      label: "Thời gian kết thúc",
      name: "endTime",
      type: "datetime-local",
      required: true,
    },
    { label: "Địa điểm", name: "location", type: "text" },
  ];

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {sessionToEdit ? "Chỉnh sửa Buổi học" : "Thêm Buổi học mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {formFields.map(({ label, name, type, required }) => (
            <Form.Group
              key={name}
              className="mb-3"
            >
              <Form.Label>{label}</Form.Label>
              {type === "textarea" ? (
                <Form.Control
                  as="textarea"
                  rows={3}
                  name={name}
                  value={sessionData[name]}
                  onChange={handleChange}
                  required={required}
                />
              ) : (
                <Form.Control
                  ref={name === "title" ? titleInputRef : null}
                  type={type}
                  name={name}
                  value={sessionData[name]}
                  onChange={handleChange}
                  required={required}
                />
              )}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Đang xử lý..."
          ) : sessionToEdit ? (
            <>
              <FontAwesomeIcon
                icon={faSave}
                className="me-2"
              />{" "}
              Lưu thay đổi
            </>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faPlus}
                className="me-2"
              />{" "}
              Thêm Buổi học
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionModal;
SessionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  courseId: PropTypes.number.isRequired,
  sessionToEdit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    location: PropTypes.string,
  }),
  onSessionAdded: PropTypes.func,
  onSessionUpdated: PropTypes.func,
};
