import PropTypes from "prop-types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles/user/user-list.css";

const UserList = ({ users, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="user-list">
      <h2 className="user-list__title">Danh sách Người dùng</h2>

      <input
        type="text"
        placeholder="Tìm kiếm người dùng..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="user-list__search"
      />

      {sortedUsers.length > 0 ? (
        <div className="user-list__table-wrapper">
          <table className="user-list__table">
            <thead>
              <tr>
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
                <th onClick={() => handleSort("name")}>
                  Tên{" "}
                  <FontAwesomeIcon
                    icon={
                      sortColumn === "name"
                        ? sortOrder === "asc"
                          ? faSortUp
                          : faSortDown
                        : faSort
                    }
                  />
                </th>
                <th>Email</th>
                <th>Role</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="user-list__link"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      onClick={() => onEdit(user)}
                      title="Sửa"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      title="Xóa"
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
        <p>Không tìm thấy người dùng nào.</p>
      )}
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserList;
