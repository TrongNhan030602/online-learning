import PropTypes from "prop-types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSort } from "@fortawesome/free-solid-svg-icons";
import "../../styles/coupon/coupon-list.css";

const CouponList = ({ coupons, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' hoặc 'desc'

  // Lọc danh sách theo mã code
  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sắp xếp danh sách
  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    if (!sortField) return 0;
    let valueA = a[sortField];
    let valueB = b[sortField];

    if (["discount", "usage_limit", "times_used"].includes(sortField)) {
      valueA = parseFloat(valueA);
      valueB = parseFloat(valueB);
    }

    if (["expires_at", "created_at", "updated_at"].includes(sortField)) {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }

    return sortOrder === "asc"
      ? valueA > valueB
        ? 1
        : -1
      : valueA < valueB
      ? 1
      : -1;
  });

  // Đổi trạng thái sắp xếp
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="coupon-list">
      <h2 className="coupon-list__title">Danh sách Mã Giảm Giá</h2>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm theo mã..."
        className="coupon-list__search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {sortedCoupons.length > 0 ? (
        <div className="coupon-list__table-wrapper">
          <table className="coupon-list__table">
            <thead>
              <tr className="coupon-list__tr">
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("id")}
                >
                  <FontAwesomeIcon icon={faSort} /> ID
                </th>
                <th className="coupon-list__td">Mã Code</th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("discount")}
                >
                  <FontAwesomeIcon icon={faSort} /> Giảm giá
                </th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("usage_limit")}
                >
                  <FontAwesomeIcon icon={faSort} />
                  Giới hạn sử dụng
                </th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("times_used")}
                >
                  <FontAwesomeIcon icon={faSort} /> Số lần đã dùng
                </th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("expires_at")}
                >
                  <FontAwesomeIcon icon={faSort} /> Hạn sử dụng
                </th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("created_at")}
                >
                  <FontAwesomeIcon icon={faSort} /> Ngày tạo
                </th>

                <th className="coupon-list__td">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedCoupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="coupon-list__td">{coupon.id}</td>
                  <td className="coupon-list__td">{coupon.code}</td>
                  <td className="coupon-list__td">
                    {parseFloat(coupon.discount)}%
                  </td>
                  <td className="coupon-list__td">{coupon.usage_limit}</td>
                  <td className="coupon-list__td">{coupon.times_used}</td>
                  <td className="coupon-list__td">
                    {new Date(coupon.expires_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="coupon-list__td">
                    {new Date(coupon.created_at).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="coupon-list__td">
                    <button
                      onClick={() => onEdit(coupon)}
                      title="Sửa mã giảm giá"
                      className="coupon-list__action-button"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(coupon.id)}
                      title="Xóa mã giảm giá"
                      className="coupon-list__action-button coupon-list__action-button--delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="coupon-list__no-data">Không có mã giảm giá nào.</p>
      )}
    </div>
  );
};

CouponList.propTypes = {
  coupons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      code: PropTypes.string.isRequired,
      discount: PropTypes.number.isRequired,
      usage_limit: PropTypes.number.isRequired,
      times_used: PropTypes.number.isRequired,
      expires_at: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CouponList;
