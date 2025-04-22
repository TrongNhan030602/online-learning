import PropTypes from "prop-types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faImage,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/blog/blog-list.css";

const BlogList = ({ blogs, onEdit, onDelete, onManageImages }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" hoặc "desc"

  // Hàm lọc danh sách theo tiêu đề
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm sắp xếp danh sách
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  });

  // Thay đổi thứ tự sắp xếp
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="blog-list">
      <h2 className="blog-list__title">Danh sách Blog</h2>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm blog..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="blog-list__search"
      />

      {sortedBlogs.length > 0 ? (
        <div className="blog-list__table-wrapper">
          <table className="blog-list__table">
            <thead>
              <tr className="blog-list__tr">
                <th
                  className="blog-list__td"
                  onClick={() => handleSort("id")}
                >
                  ID{" "}
                  <FontAwesomeIcon
                    icon={
                      sortColumn === "id"
                        ? sortOrder === "asc"
                          ? faSortUp
                          : faSortDown
                        : faSort
                    }
                  />
                </th>
                <th
                  className="blog-list__td"
                  onClick={() => handleSort("title")}
                >
                  Tiêu đề{" "}
                  <FontAwesomeIcon
                    icon={
                      sortColumn === "title"
                        ? sortOrder === "asc"
                          ? faSortUp
                          : faSortDown
                        : faSort
                    }
                  />
                </th>
                <th
                  className="blog-list__td"
                  onClick={() => handleSort("content")}
                >
                  Mô tả{" "}
                  <FontAwesomeIcon
                    icon={
                      sortColumn === "content"
                        ? sortOrder === "asc"
                          ? faSortUp
                          : faSortDown
                        : faSort
                    }
                  />
                </th>
                <th className="blog-list__td">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="blog-list__td">{blog.id}</td>
                  <td className="blog-list__td">
                    <a
                      href="#!"
                      className="blog-list__link"
                      onClick={(e) => e.preventDefault()}
                    >
                      {blog.title}
                    </a>
                  </td>
                  <td className="blog-list__td">
                    <div className="blog-list__content">{blog.content}</div>
                  </td>
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
