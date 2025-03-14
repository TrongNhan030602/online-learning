import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import faqApi from "../../api/faqApi";
import { useToast } from "../../hooks/useToast";
import "../../styles/faqs/faq-modal.css";

const FaqModal = ({ show, handleClose, initialData, onSuccess }) => {
  const { addToast } = useToast();
  const [faq, setFaq] = useState({
    question: "",
    answer: "",
    category: "",
    status: 1,
    priority: 10,
  });

  useEffect(() => {
    if (initialData) {
      setFaq(initialData);
    } else {
      setFaq({
        question: "",
        answer: "",
        category: "",
        status: 1,
        priority: 10,
      });
    }
  }, [initialData, show]);

  const handleChange = (e) => {
    setFaq({ ...faq, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData?.id) {
        await faqApi.updateFaq(initialData.id, faq);
      } else {
        await faqApi.createFaq(faq);
      }
      addToast({
        title: "Thành công!",
        message: initialData
          ? "Câu hỏi đã được cập nhật."
          : "Câu hỏi mới đã được thêm.",
        type: "success",
        duration: 3000,
      });
      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Lỗi khi lưu FAQ:", err);
    }
  };

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
        <Form
          onSubmit={handleSubmit}
          className="faq-form"
        >
          <Form.Group
            controlId="question"
            className="faq-form__group"
          >
            <Form.Label className="faq-form__label">Câu hỏi</Form.Label>
            <Form.Control
              type="text"
              name="question"
              value={faq.question}
              onChange={handleChange}
              required
              className="faq-form__input"
            />
          </Form.Group>

          <Form.Group
            controlId="answer"
            className="faq-form__group"
          >
            <Form.Label className="faq-form__label">Trả lời</Form.Label>
            <Form.Control
              as="textarea"
              name="answer"
              value={faq.answer}
              onChange={handleChange}
              required
              className="faq-form__textarea"
            />
          </Form.Group>

          <Form.Group
            controlId="category"
            className="faq-form__group"
          >
            <Form.Label className="faq-form__label">Danh mục</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={faq.category}
              onChange={handleChange}
              className="faq-form__input"
            />
          </Form.Group>

          <Form.Group
            controlId="status"
            className="faq-form__group"
          >
            <Form.Label className="faq-form__label">Trạng thái</Form.Label>
            <Form.Select
              name="status"
              value={faq.status}
              onChange={handleChange}
              className="faq-form__select"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Tạm ẩn</option>
            </Form.Select>
          </Form.Group>

          <Form.Group
            controlId="priority"
            className="faq-form__group"
          >
            <Form.Label className="faq-form__label">Độ ưu tiên</Form.Label>
            <Form.Control
              type="number"
              name="priority"
              value={faq.priority}
              onChange={handleChange}
              min={1}
              max={100}
              className="faq-form__input"
            />
          </Form.Group>

          <div className="faq-form__actions">
            <Button
              type="submit"
              variant="primary"
              className="faq-form__button faq-form__button--submit"
            >
              {initialData ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              className="faq-form__button faq-form__button--cancel"
            >
              Hủy
            </Button>
          </div>
        </Form>
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
