import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../styles/faqs/faq-list.css";
const getStatusText = (status) => {
  return status === 1 ? "Hoạt động" : "Tạm ẩn";
};

const FaqList = ({ faqs, onEdit, onDelete }) => {
  return (
    <div className="faq-list">
      <h2 className="faq-list__title">Danh sách câu hỏi</h2>
      <div className="faq-list__table-wrapper">
        <table className="faq-list__table">
          <thead>
            <tr className="faq-list__tr">
              <th className="faq-list__td">ID</th>
              <th className="faq-list__td">Câu hỏi</th>
              <th className="faq-list__td">Danh mục</th>
              <th className="faq-list__td">Trạng thái</th>
              <th className="faq-list__td">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(faqs) && faqs.length > 0 ? (
              faqs.map((faq) => (
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
                      title="Sửa faqs"
                      className="faq-list__action-button"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(faq.id)}
                      title="Xóa faq"
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
