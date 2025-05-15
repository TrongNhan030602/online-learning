import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@/hooks/useToast";
import faqApi from "@/api/faqApi";
import "../../styles/faqs/faq-form.css";

// Schema validation với Yup
const schema = yup.object().shape({
  question: yup
    .string()
    .required("Câu hỏi không được để trống")
    .min(5, "Câu hỏi phải có ít nhất 5 ký tự"),
  answer: yup
    .string()
    .required("Câu trả lời không được để trống")
    .min(10, "Câu trả lời phải có ít nhất 10 ký tự"),
  category: yup.string().required("Danh mục không được để trống"),
  priority: yup
    .number()
    .required("Độ ưu tiên không được để trống")
    .min(1, "Độ ưu tiên phải từ 1 đến 100")
    .max(100, "Độ ưu tiên phải từ 1 đến 100"),
  status: yup.number().oneOf([0, 1], "Trạng thái không hợp lệ"),
});

const FaqForm = ({ initialData = null, onSuccess, onCancel }) => {
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      question: "",
      answer: "",
      category: "",
      status: 1,
      priority: 10,
    },
  });

  const onSubmit = async (data) => {
    try {
      if (initialData?.id) {
        await faqApi.updateFaq(initialData.id, data);
      } else {
        await faqApi.createFaq(data);
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
      reset();
    } catch (err) {
      console.error("Lỗi khi lưu FAQ:", err);
    }
  };

  return (
    <form
      className="faq-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="faq-form__title">
        {initialData ? "Cập nhật FAQ" : "Thêm Câu Hỏi Mới"}
      </h3>

      <div className="faq-form__group">
        <label className="faq-form__label">Câu hỏi</label>
        <input
          type="text"
          {...register("question")}
          className={`faq-form__input ${
            errors.question ? "faq-form__input--error" : ""
          }`}
        />
        {errors.question && (
          <p className="faq-form__error">{errors.question.message}</p>
        )}
      </div>

      <div className="faq-form__group">
        <label className="faq-form__label">Trả lời</label>
        <textarea
          {...register("answer")}
          className={`faq-form__textarea ${
            errors.answer ? "faq-form__input--error" : ""
          }`}
          rows={5}
        ></textarea>
        {errors.answer && (
          <p className="faq-form__error">{errors.answer.message}</p>
        )}
      </div>

      <div className="faq-form__group">
        <label className="faq-form__label">Danh mục</label>
        <input
          type="text"
          {...register("category")}
          className={`faq-form__input ${
            errors.category ? "faq-form__input--error" : ""
          }`}
        />
        {errors.category && (
          <p className="faq-form__error">{errors.category.message}</p>
        )}
      </div>

      <div className="faq-form__group">
        <label className="faq-form__label">Trạng thái</label>
        <select
          {...register("status")}
          className={`faq-form__select ${
            errors.status ? "faq-form__input--error" : ""
          }`}
        >
          <option value={1}>Hoạt động</option>
          <option value={0}>Tạm ẩn</option>
        </select>
        {errors.status && (
          <p className="faq-form__error">{errors.status.message}</p>
        )}
      </div>

      <div className="faq-form__group">
        <label className="faq-form__label">Độ ưu tiên</label>
        <input
          type="number"
          {...register("priority")}
          min={1}
          max={100}
          className={`faq-form__input ${
            errors.priority ? "faq-form__input--error" : ""
          }`}
        />
        {errors.priority && (
          <p className="faq-form__error">{errors.priority.message}</p>
        )}
      </div>

      <div className="faq-form__actions">
        <button
          type="submit"
          className="faq-form__button faq-form__button--submit"
          disabled={isSubmitting}
        >
          {initialData ? "Cập nhật" : "Thêm mới"}
        </button>
        <button
          type="button"
          onClick={onCancel}
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
