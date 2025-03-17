import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import faqApi from "../../api/faqApi";
import { useToast } from "../../hooks/useToast";
import "../../styles/faqs/faq-form.css";

const FaqForm = ({ initialData = null, onSuccess, onCancel }) => {
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
  }, [initialData]);

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
      onSuccess(); // Gọi onSuccess để thông báo thành công và đóng modal
    } catch (err) {
      console.error("Lỗi khi lưu FAQ:", err);
    }
  };

  return (
    <form
      className="faq-form"
      onSubmit={handleSubmit}
    >
      <h3 className="faq-form__title">
        {initialData ? "Cập nhật FAQ" : "Thêm Câu Hỏi Mới"}
      </h3>

      <div className="faq-form__group">
        <label className="faq-form__label">Câu hỏi</label>
        <input
          type="text"
          name="question"
          value={faq.question}
          onChange={handleChange}
          required
          className="faq-form__input"
        />
      </div>

      <div className="faq-form__group">
        <label className="faq-form__label">Trả lời</label>
        <textarea
          name="answer"
          value={faq.answer}
          onChange={handleChange}
          required
          className="faq-form__textarea"
        ></textarea>
      </div>

      <div className="faq-form__group">
        <label className="faq-form__label">Danh mục</label>
        <input
          type="text"
          name="category"
          value={faq.category}
          onChange={handleChange}
          className="faq-form__input"
        />
      </div>

      <div className="faq-form__group">
        <label className="faq-form__label">Trạng thái</label>
        <select
          name="status"
          value={faq.status}
          onChange={handleChange}
          className="faq-form__select"
        >
          <option value={1}>Hoạt động</option>
          <option value={0}>Tạm ẩn</option>
        </select>
      </div>

      <div className="faq-form__group">
        <label className="faq-form__label">Độ ưu tiên</label>
        <input
          type="number"
          name="priority"
          value={faq.priority}
          onChange={handleChange}
          min={1}
          max={100}
          className="faq-form__input"
        />
      </div>

      <div className="faq-form__actions">
        <button
          type="submit"
          className="faq-form__button faq-form__button--submit"
        >
          {initialData ? "Cập nhật" : "Thêm mới"}
        </button>
        <button
          type="button"
          onClick={onCancel} // Đảm bảo gọi onCancel để đóng modal khi người dùng hủy
          className="faq-form__button faq-form__button--cancel"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

FaqForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default FaqForm;
