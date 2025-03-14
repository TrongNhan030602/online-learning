import { useState, useEffect } from "react";
import blogApi from "../../../api/blogApi";
import BlogList from "../../../components/Blogs/BlogList";
import BlogModal from "../../../components/Blogs/BlogModal";
import ImageManagerModal from "../../../components/Blogs/ImageManagerModal";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";
import Loading from "../../../components/Common/Loading";
import { useToast } from "../../../hooks/useToast";
import "../../../styles/blog/admin-blogs.css";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    blogId: null,
  });

  const { addToast } = useToast();

  const fetchBlogs = () => {
    setLoading(true);
    blogApi
      .getBlogs()
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách blog:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowBlogModal(true);
  };

  const handleAdd = () => {
    setEditingBlog(null);
    setShowBlogModal(true);
  };
  const handleUploadImage = (blog) => {
    setEditingBlog(blog);
    setShowImageModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, blogId: id });
  };

  const confirmDeleteBlog = () => {
    blogApi
      .deleteBlog(confirmDelete.blogId)
      .then(() => {
        addToast({
          title: "Thành công!",
          message: "Blog đã được xóa.",
          type: "success",
          duration: 3000,
        });
        fetchBlogs();
      })
      .catch((err) => {
        addToast({
          title: "Lỗi!",
          message: err.response?.data?.message || "Xóa blog thất bại.",
          type: "error",
          duration: 3000,
        });
      });
    setConfirmDelete({ isOpen: false, blogId: null });
  };

  return (
    <div className="admin-blogs">
      <div className="admin-blogs__header">
        <h2 className="admin-blogs__title">Quản lý Blog</h2>
        <div className="admin-blog__actions">
          <button
            className="admin-blogs__btn admin-blog__btn--primary"
            onClick={handleAdd}
          >
            + Thêm Blog
          </button>
        </div>
      </div>

      {loading ? (
        <Loading
          text="Đang tải blog..."
          size="lg"
        />
      ) : (
        <BlogList
          blogs={blogs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onManageImages={handleUploadImage}
        />
      )}

      <BlogModal
        show={showBlogModal}
        handleClose={() => setShowBlogModal(false)}
        initialData={editingBlog}
        onSuccess={fetchBlogs}
      />
      <ImageManagerModal
        show={showImageModal}
        handleClose={() => setShowImageModal(false)}
        blog={editingBlog}
      />

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa blog này không?"
        onConfirm={confirmDeleteBlog}
        onCancel={() => setConfirmDelete({ isOpen: false, blogId: null })}
      />
    </div>
  );
};

export default AdminBlogs;
