import { useEffect, useState, useMemo } from "react";
import {
  Container,
  Form,
  Button,
  Table,
  Spinner,
  Alert,
  Row,
  Col,
  Badge,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faPen,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/useToast";

import notificationApi from "@/api/notificationApi";
import trainingProgramApi from "@/api/trainingProgramApi";
import ConfirmDialog from "@/components/Common/ConfirmDialog";
import "../../../styles/notifications/admin-notifications.css";

const ITEMS_PER_PAGE = 10;

const AdminNotifications = () => {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    training_program_id: "",
    title: "",
    body: "",
    type: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    id: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    training_program_id: "",
    title: "",
    body: "",
    type: "",
  });
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchTrainingPrograms();
  }, []);

  const fetchNotifications = async () => {
    try {
      // setLoading(true);
      const res = await notificationApi.getAll();
      setNotifications(res.data?.data || []);
    } catch {
      setError("Lỗi khi tải danh sách thông báo");
    } finally {
      // setLoading(false);
    }
  };

  const fetchTrainingPrograms = async () => {
    try {
      const res = await trainingProgramApi.getAll();
      setTrainingPrograms(res.data?.data || []);
    } catch {
      setError("Lỗi khi tải danh sách chương trình đào tạo");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.training_program_id || !form.title || !form.body) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    try {
      setSubmitting(true);
      await notificationApi.create(form);

      await fetchNotifications();
      await fetchTrainingPrograms();

      setForm({ training_program_id: "", title: "", body: "", type: "" });
      setShowModal(false);
      addToast({
        title: "Thành công!",
        message: "Tạo thông báo mới thành công",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error("Lỗi khi tạo thông báo:", err);
      setError("Lỗi khi tạo thông báo mới");
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const handleCancelDelete = () =>
    setConfirmDelete({ isOpen: false, id: null });

  const handleConfirmDelete = async () => {
    try {
      await notificationApi.delete(confirmDelete.id);
      setNotifications((prev) => prev.filter((n) => n.id !== confirmDelete.id));
      addToast({
        title: "Thành công!",
        message: "Xóa thông báo thành công",
        type: "success",
        duration: 3000,
      });
    } catch {
      setError("Lỗi khi xóa thông báo");
    } finally {
      // setLoading(false);
      handleCancelDelete();
    }
  };

  const startEdit = (notification) => {
    setEditingId(notification.id);
    setEditForm({
      training_program_id: notification.training_program_id || "",
      title: notification.title,
      body: notification.body,
      type: notification.type || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ training_program_id: "", title: "", body: "", type: "" });
  };

  const saveEdit = async () => {
    if (!editForm.training_program_id || !editForm.title || !editForm.body) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc khi chỉnh sửa");
      return;
    }

    try {
      setSubmitting(true);
      const res = await notificationApi.update(editingId, editForm);
      const updated = res.data.data;
      setNotifications((prev) =>
        prev.map((n) => (n.id === editingId ? updated : n))
      );
      addToast({
        title: "Thành công!",
        message: "Cập nhật thông báo thành công",
        type: "success",
        duration: 3000,
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi cập nhật thông báo");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];
    if (searchKeyword)
      result = result.filter((n) =>
        n.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    if (filterType) result = result.filter((n) => n.type === filterType);
    result.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at)
    );
    return result;
  }, [notifications, searchKeyword, filterType, sortOrder]);

  const pageCount = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatType = (type) =>
    ({ announcement: "Thông báo", exam: "Thi", reminder: "Nhắc nhở" }[type] ||
    "N/A");
  const getBadgeVariant = (type) =>
    ({ exam: "danger", reminder: "warning", announcement: "primary" }[type] ||
    "secondary");

  return (
    <Container className="admin-notifications">
      <h1 className="admin-notifications__title">Quản lý Thông báo</h1>

      <div className="text-center mb-5">
        <button
          className="admin-notifications__btn admin-notifications__btn--primary"
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon
            icon={faPlus}
            className="me-2"
          />{" "}
          Thêm Thông báo mới
        </button>
      </div>

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError("")}
          dismissible
        >
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert
          variant="success"
          onClose={() => setSuccessMessage("")}
          dismissible
        >
          {successMessage}
        </Alert>
      )}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm Thông báo mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Chương trình đào tạo <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="training_program_id"
                value={form.training_program_id}
                onChange={handleChange}
              >
                <option value="">-- Chọn chương trình --</option>
                {trainingPrograms.map((tp) => (
                  <option
                    key={tp.id}
                    value={tp.id}
                  >
                    {tp.name} ({tp.code})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Tiêu đề <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Nội dung <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="body"
                value={form.body}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại thông báo</Form.Label>
              <Form.Select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="">-- Chọn loại --</option>
                <option value="exam">Thi</option>
                <option value="announcement">Thông báo</option>
                <option value="reminder">Nhắc nhở</option>
              </Form.Select>
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? (
                <Spinner
                  animation="border"
                  size="sm"
                />
              ) : (
                "Thêm mới"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Search & Filter */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Mới nhất</option>
            <option value="asc">Cũ nhất</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">-- Lọc theo loại --</option>
            <option value="announcement">Thông báo</option>
            <option value="exam">Thi</option>
            <option value="reminder">Nhắc nhở</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Table */}
      <Table
        bordered
        hover
        responsive
        className="admin-notifications__table"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Chương trình</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Loại</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedNotifications.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="text-center"
              >
                Không có thông báo nào
              </td>
            </tr>
          )}
          {paginatedNotifications.map((n, index) => (
            <tr key={n.id}>
              <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
              <td>
                {trainingPrograms.find((tp) => tp.id === n.training_program_id)
                  ?.name || "N/A"}
              </td>
              <td>
                {editingId === n.id ? (
                  <Form.Control
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                  />
                ) : (
                  n.title
                )}
              </td>
              <td>
                {editingId === n.id ? (
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="body"
                    value={editForm.body}
                    onChange={handleEditChange}
                  />
                ) : (
                  n.body
                )}
              </td>
              <td>
                {editingId === n.id ? (
                  <Form.Select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                  >
                    <option value="">-- Chọn loại --</option>
                    <option value="exam">Thi</option>
                    <option value="announcement">Thông báo</option>
                    <option value="reminder">Nhắc nhở</option>
                  </Form.Select>
                ) : (
                  <Badge bg={getBadgeVariant(n.type)}>
                    {formatType(n.type)}
                  </Badge>
                )}
              </td>
              <td>
                {new Date(n.created_at).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td>
                {editingId === n.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={saveEdit}
                      disabled={submitting}
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faSave} />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={cancelEdit}
                      disabled={submitting}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => startEdit(n)}
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => openDeleteConfirm(n.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="d-flex justify-content-center my-3">
          {[...Array(pageCount)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "primary" : "outline-primary"}
              className="me-1"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa thông báo này?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Container>
  );
};

export default AdminNotifications;
