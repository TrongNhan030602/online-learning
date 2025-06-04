import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import blogApi from "@/api/blogApi";
import "../../styles/blog/blog-form.css";

const schema = yup.object().shape({
  title: yup.string().required("Tiêu đề không được để trống").min(5),
  type: yup.string().required("Loại bài viết bắt buộc"),
  summary: yup.string().max(255),
  published_at: yup.date().nullable(),
  status: yup.string().oneOf(["draft", "published"]).required(),
  content: yup.string().required("Nội dung không được để trống").min(20),
});

// Hàm chuyển định dạng '2025-06-03 14:30:00' -> '2025-06-03T14:30'
const formatDateTimeLocal = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";

  const pad = (n) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const HH = pad(d.getHours());
  const mm = pad(d.getMinutes());

  return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
};

const BlogForm = ({ initialData = null, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData
      ? {
          ...initialData,
          published_at: formatDateTimeLocal(initialData.published_at),
        }
      : {
          title: "",
          type: "",
          summary: "",
          published_at: "",
          status: "draft",
          content: "",
        },
  });

  useEffect(() => {
    reset(
      initialData
        ? {
            ...initialData,
            published_at: formatDateTimeLocal(initialData.published_at),
          }
        : {
            title: "",
            type: "",
            summary: "",
            published_at: "",
            status: "draft",
            content: "",
          }
    );
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    try {
      if (!data.published_at) {
        data.published_at = null;
      } else if (typeof data.published_at === "string") {
        // Chuyển '2025-06-03T14:30' thành '2025-06-03 14:30:00'
        data.published_at = data.published_at.replace("T", " ") + ":00";
      } else if (data.published_at instanceof Date) {
        // Nếu là Date object thì format lại thành string cho backend
        const d = data.published_at;
        const pad = (n) => n.toString().padStart(2, "0");
        const yyyy = d.getFullYear();
        const MM = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const HH = pad(d.getHours());
        const mm = pad(d.getMinutes());
        const ss = pad(d.getSeconds());
        data.published_at = `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
      } else {
        // Nếu kiểu khác, convert thành string an toàn
        data.published_at = String(data.published_at);
      }

      if (initialData) {
        await blogApi.updateBlog(initialData.id, data);
      } else {
        await blogApi.createBlog(data);
      }
      onSuccess();
      reset();
    } catch (err) {
      console.error("Lỗi khi lưu blog:", err);
      alert("Lỗi khi lưu blog");
    }
  };

  return (
    <form
      className="blog-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="blog-form__group">
        <label>Tiêu đề:</label>
        <input
          type="text"
          {...register("title")}
        />
        {errors.title && <p className="error">{errors.title.message}</p>}
      </div>

      <div className="blog-form__group">
        <label>Loại bài viết:</label>
        <select {...register("type")}>
          <option value="">Chọn loại</option>
          <option value="academy">Tin về học viện Design24</option>
          <option value="industry">Tin về ngành</option>
          <option value="news">Tin tức chung</option>
          <option value="tutorial">Hướng dẫn</option>
        </select>
        {errors.type && <p className="error">{errors.type.message}</p>}
      </div>

      <div className="blog-form__group">
        <label>Tóm tắt:</label>
        <textarea
          {...register("summary")}
          rows={3}
        />
        {errors.summary && <p className="error">{errors.summary.message}</p>}
      </div>

      <div className="blog-form__group">
        <label>Ngày xuất bản:</label>
        <input
          type="datetime-local"
          {...register("published_at")}
        />
        {errors.published_at && (
          <p className="error">{errors.published_at.message}</p>
        )}
      </div>

      <div className="blog-form__group">
        <label>Trạng thái:</label>
        <select {...register("status")}>
          <option value="draft">Nháp</option>
          <option value="published">Đã xuất bản</option>
        </select>
        {errors.status && <p className="error">{errors.status.message}</p>}
      </div>

      <div className="blog-form__group">
        <label>Nội dung:</label>
        <textarea
          {...register("content")}
          rows={8}
        />
        {errors.content && <p className="error">{errors.content.message}</p>}
      </div>

      <div className="blog-form__actions">
        <button
          type="submit"
          disabled={isSubmitting}
        >
          {initialData ? "Cập nhật" : "Thêm"}
        </button>
        <button
          type="button"
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
