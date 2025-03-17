import PropTypes from "prop-types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSort } from "@fortawesome/free-solid-svg-icons";
import "../../styles/coupon/coupon-list.css";

const CouponList = ({ coupons, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' hoặc 'desc'

  // Hàm lọc danh sách mã giảm giá theo mã code
  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm sắp xếp danh sách
  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    if (!sortField) return 0;
    let valueA = a[sortField];
    let valueB = b[sortField];

    if (
      sortField === "discount" ||
      sortField === "usage_limit" ||
      sortField === "times_used"
    ) {
      valueA = parseFloat(valueA);
      valueB = parseFloat(valueB);
    }

    if (
      sortField === "expires_at" ||
      sortField === "created_at" ||
      sortField === "updated_at"
    ) {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }

    if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
    return valueA < valueB ? 1 : -1;
  });

  // Hàm đổi trạng thái sắp xếp
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
                  ID <FontAwesomeIcon icon={faSort} />
                </th>
                <th className="coupon-list__td">Mã Code</th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("discount")}
                >
                  Giảm giá <FontAwesomeIcon icon={faSort} />
                </th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("expires_at")}
                >
                  Hạn sử dụng <FontAwesomeIcon icon={faSort} />
                </th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("usage_limit")}
                >
                  Giới hạn sử dụng <FontAwesomeIcon icon={faSort} />
                </th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("times_used")}
                >
                  Số lần đã dùng <FontAwesomeIcon icon={faSort} />
                </th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("created_at")}
                >
                  Ngày tạo <FontAwesomeIcon icon={faSort} />
                </th>
                <th
                  className="coupon-list__td"
                  onClick={() => handleSort("updated_at")}
                >
                  Ngày cập nhật <FontAwesomeIcon icon={faSort} />
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
                  <td className="coupon-list__td">
                    {new Date(coupon.expires_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="coupon-list__td">{coupon.usage_limit}</td>
                  <td className="coupon-list__td">{coupon.times_used}</td>
                  <td className="coupon-list__td">
                    {new Date(coupon.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="coupon-list__td">
                    {new Date(coupon.updated_at).toLocaleDateString("vi-VN")}
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
      discount: PropTypes.string.isRequired,
      expires_at: PropTypes.string.isRequired,
      usage_limit: PropTypes.number.isRequired,
      times_used: PropTypes.number.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CouponList;
