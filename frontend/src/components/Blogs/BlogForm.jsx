import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import blogApi from "../../api/blogApi";
import "../../styles/blog/blog-form.css";

const BlogForm = ({ initialData = null, onSuccess, onCancel }) => {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setBlog(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (initialData && initialData.id) {
        await blogApi.updateBlog(initialData.id, blog);
        onSuccess(blog);
      } else {
        await blogApi.createBlog(blog);
        onSuccess(blog);
      }
    } catch (err) {
      console.error("Lỗi khi lưu blog:", err);
      setError("Đã có lỗi xảy ra khi lưu blog.");
    }
  };

  return (
    <form
      className="blog-form"
      onSubmit={handleSubmit}
    >
      {error && <p className="blog-form__error">{error}</p>}

      <div className="blog-form__group">
        <label className="blog-form__label">Tiêu đề:</label>
        <input
          type="text"
          name="title"
          className="blog-form__input"
          value={blog.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="blog-form__group">
        <label className="blog-form__label">Nội dung:</label>
        <textarea
          name="content"
          className="blog-form__textarea"
          value={blog.content}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="blog-form__actions">
        <button
          type="submit"
          className="blog-form__button blog-form__button--submit"
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
