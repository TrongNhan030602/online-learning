import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faImage } from "@fortawesome/free-solid-svg-icons"; // Thêm icon hình ảnh
import "../../styles/blog/blog-list.css";

const BlogList = ({ blogs, onEdit, onDelete, onManageImages }) => {
  return (
    <div className="blog-list">
      <h2 className="blog-list__title">Danh sách Blog</h2>
      {blogs.length > 0 ? (
        <div className="blog-list__table-wrapper">
          <table className="blog-list__table">
            <thead>
              <tr className="blog-list__tr">
                <th className="blog-list__td">ID</th>
                <th className="blog-list__td">Tiêu đề</th>
                <th className="blog-list__td">Mô tả</th>
                <th className="blog-list__td">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="blog-list__td">{blog.id}</td>
                  <td className="blog-list__td">
                    <a
                      href="#!"
                      className="blog-list__link"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {blog.title}
                    </a>
                  </td>
                  <td className="blog-list__td">{blog.content}</td>
                  <td className="blog-list__td">
                    <button
                      onClick={() => onEdit(blog)}
                      title="Sửa blog"
                      className="blog-list__action-button"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(blog.id)}
                      title="Xóa blog"
                      className="blog-list__action-button blog-list__action-button--delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      onClick={() => onManageImages(blog)}
                      title="Quản lý ảnh"
                      className="blog-list__action-button blog-list__action-button--image"
                    >
                      <FontAwesomeIcon icon={faImage} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="blog-list__no-data">Không có blog nào.</p>
      )}
    </div>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onManageImages: PropTypes.func.isRequired,
};

export default BlogList;
