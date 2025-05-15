import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import blogApi from "@/api/blogApi";
import "../../styles/blog/blog-form.css";

// Schema validation bằng Yup
const schema = yup.object().shape({
  title: yup
    .string()
    .required("Tiêu đề không được để trống")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  content: yup
    .string()
    .required("Nội dung không được để trống")
    .min(20, "Nội dung phải có ít nhất 20 ký tự"),
});

const BlogForm = ({ initialData = null, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || { title: "", content: "" },
  });

  // Xử lý gửi form
  const onSubmit = async (data) => {
    try {
      if (initialData) {
        await blogApi.updateBlog(initialData.id, data);
      } else {
        await blogApi.createBlog(data);
      }
      onSuccess(data);
      reset();
    } catch (err) {
      console.error("Lỗi khi lưu blog:", err);
    }
  };

  return (
    <form
      className="blog-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="blog-form__group">
        <label className="blog-form__label">Tiêu đề:</label>
        <input
          type="text"
          {...register("title")}
          className={`blog-form__input ${
            errors.title ? "blog-form__input--error" : ""
          }`}
        />
        {errors.title && (
          <p className="blog-form__error">{errors.title.message}</p>
        )}
      </div>

      <div className="blog-form__group">
        <label className="blog-form__label">Nội dung:</label>
        <textarea
          {...register("content")}
          className={`blog-form__textarea ${
            errors.content ? "blog-form__input--error" : ""
          }`}
          rows={5}
        />
        {errors.content && (
          <p className="blog-form__error">{errors.content.message}</p>
        )}
      </div>

      <div className="blog-form__actions">
        <button
          type="submit"
          className="blog-form__button blog-form__button--submit"
          disabled={isSubmitting}
        >
          {initialData ? "Cập nhật" : "Thêm"}
        </button>
        <button
          type="button"
          className="blog-form__button blog-form__button--cancel"
          onClick={onCancel}
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

BlogForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default BlogForm;
