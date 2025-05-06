import { useState, useEffect } from "react";
import userApi from "../../../api/userApi";
import UserList from "../../../components/Users/UserList";
import UserModal from "../../../components/Users/UserModal";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";
import Loading from "../../../components/Common/Loading";
import { useToast } from "../../../hooks/useToast";
import "../../../styles/user/admin-users.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    userId: null,
  });

  const { addToast } = useToast();

  const fetchUsers = () => {
    setLoading(true);
    userApi
      .getUsers()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách người dùng:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, userId: id });
  };

  const confirmDeleteUser = () => {
    userApi
      .deleteUser(confirmDelete.userId)
      .then(() => {
        addToast({
          title: "Thành công!",
          message: "Người dùng đã được xóa.",
          type: "success",
          duration: 3000,
        });
        fetchUsers();
      })
      .catch((err) => {
        addToast({
          title: "Lỗi!",
          message: err.response?.data?.message || "Xóa người dùng thất bại.",
          type: "error",
          duration: 3000,
        });
      });
    setConfirmDelete({ isOpen: false, userId: null });
  };

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <h2 className="admin-users__title">Quản lý Người dùng</h2>
        <div className="admin-users__actions">
          <button
            className="admin-users__btn admin-users__btn--primary"
            onClick={handleAdd}
          >
            + Thêm Người dùng
          </button>
        </div>
      </div>

      {loading ? (
        <Loading
          text="Đang tải dữ liệu..."
          size="lg"
          variant="danger"
        />
      ) : users.length > 0 ? (
        <UserList
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <p>Không có người dùng nào để hiển thị.</p>
      )}

      <UserModal
        show={showUserModal}
        handleClose={() => setShowUserModal(false)}
        initialData={editingUser}
        onSuccess={fetchUsers}
      />

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa người dùng này không?"
        onConfirm={confirmDeleteUser}
        onCancel={() => setConfirmDelete({ isOpen: false, userId: null })}
      />
    </div>
  );
};

export default AdminUsers;
