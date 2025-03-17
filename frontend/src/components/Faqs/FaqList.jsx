import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSort } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "../../styles/faqs/faq-list.css";

const getStatusText = (status) => (status === 1 ? "Hoạt động" : "Tạm ẩn");

const FaqList = ({ faqs, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Lọc danh sách theo danh mục và trạng thái
  const filteredFaqs = faqs.filter((faq) => {
    return (
      (!categoryFilter || faq.category === categoryFilter) &&
      (!statusFilter || faq.status.toString() === statusFilter)
    );
  });

  // Sắp xếp danh sách
  const sortedFaqs = [...filteredFaqs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Xử lý khi nhấn vào tiêu đề cột để sắp xếp
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="faq-list">
      <h2 className="faq-list__title">Danh sách câu hỏi</h2>

      {/* Bộ lọc */}
      <div className="faq-list__filters">
        <select
          className="faq-list__filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {[...new Set(faqs.map((faq) => faq.category))].map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

        <select
          className="faq-list__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Tạm ẩn</option>
        </select>
      </div>

      {/* Bảng danh sách */}
      <div className="faq-list__table-wrapper">
        <table className="faq-list__table">
          <thead>
            <tr className="faq-list__tr">
              <th
                className="faq-list__td"
                onClick={() => handleSort("id")}
              >
                ID <FontAwesomeIcon icon={faSort} />
              </th>
              <th
                className="faq-list__td"
                onClick={() => handleSort("question")}
              >
                Câu hỏi <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="faq-list__td">Danh mục</th>
              <th className="faq-list__td">Trạng thái</th>
              <th className="faq-list__td">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedFaqs.length > 0 ? (
              sortedFaqs.map((faq) => (
                <tr key={faq.id}>
                  <td className="faq-list__td">{faq.id}</td>
                  <td className="faq-list__td">
                    <Link
                      className="faq-list__link"
                      to={`/admin/faqs/${faq.id}`}
                    >
                      {faq.question}
                    </Link>
                  </td>
                  <td className="faq-list__td">{faq.category}</td>
                  <td className="faq-list__td">{getStatusText(faq.status)}</td>
                  <td className="faq-list__td">
                    <button
                      onClick={() => onEdit(faq)}
                      title="Sửa câu hỏi"
                      className="faq-list__action-button"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(faq.id)}
                      title="Xóa câu hỏi"
                      className="faq-list__action-button faq-list__action-button--delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="faq-list__tr">
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  Không có dữ liệu FAQ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

FaqList.propTypes = {
  faqs: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FaqList;
