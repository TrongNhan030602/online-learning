import PropTypes from "prop-types";
import { useState } from "react";
import { NavLink } from "react-router-dom";
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

const typeLabels = {
  academy: "Tin học viện Design24",
  industry: "Tin về ngành",
  news: "Tin tức chung",
  tutorial: "Hướng dẫn",
};

const BlogList = ({ blogs, onEdit, onDelete, onManageImages }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredBlogs = blogs
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((blog) => (filterType ? blog.type === filterType : true));

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (sortColumn === "published_at") {
      valA = valA ? new Date(valA).getTime() : 0;
      valB = valB ? new Date(valB).getTime() : 0;
    }

    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    return 0;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBlogs = sortedBlogs.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(sortedBlogs.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="blog-list">
      <h2 className="blog-list__title">Danh sách Blog</h2>

      <input
        type="text"
        placeholder="Tìm kiếm blog..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="blog-list__search"
      />

      <div
        className="blog-list__filter"
        style={{ marginBottom: "1rem" }}
      >
        <label>
          Lọc theo loại:{" "}
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Tất cả</option>
            {Object.entries(typeLabels).map(([key, label]) => (
              <option
                key={key}
                value={key}
              >
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {currentBlogs.length > 0 ? (
        <>
          <div className="blog-list__table-wrapper">
            <table className="blog-list__table">
              <thead>
                <tr className="blog-list__tr">
                  <th onClick={() => handleSort("id")}>
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
                  <th onClick={() => handleSort("title")}>
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
                  <th onClick={() => handleSort("type")}>
                    Loại bài viết{" "}
                    <FontAwesomeIcon
                      icon={
                        sortColumn === "type"
                          ? sortOrder === "asc"
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                  <th>Tóm tắt</th>
                  <th onClick={() => handleSort("published_at")}>
                    Ngày xuất bản{" "}
                    <FontAwesomeIcon
                      icon={
                        sortColumn === "published_at"
                          ? sortOrder === "asc"
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>{blog.id}</td>
                    <td>
                      <NavLink
                        to={`/admin/blogs/${blog.id}`}
                        className="blog-list__link"
                      >
                        {blog.title}
                      </NavLink>
                    </td>
                    <td>{typeLabels[blog.type] || blog.type}</td>
                    <td>
                      {blog.summary || blog.content.slice(0, 100) + "..."}
                    </td>
                    <td>{formatDate(blog.published_at)}</td>
                    <td>
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

          <div
            className="blog-list__pagination"
            style={{ marginTop: "1rem" }}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-button ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
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
      type: PropTypes.string,
      summary: PropTypes.string,
      published_at: PropTypes.string,
      content: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onManageImages: PropTypes.func.isRequired,
};

export default BlogList;
