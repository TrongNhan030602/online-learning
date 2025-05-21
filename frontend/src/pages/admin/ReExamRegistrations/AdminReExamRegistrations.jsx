import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Badge,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCheckCircle,
  faTimesCircle,
  faEdit,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/useToast";

import reExamRegistrationApi from "@/api/reExamRegistrationApi";
import Loading from "@/components/common/Loading";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import "../../../styles/re-exam-schedules/re-exam-schedule.css";

const renderStatus = (status) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          bg="warning"
          text="dark"
        >
          <FontAwesomeIcon
            icon={faClock}
            className="me-1"
          />
          Đang chờ
        </Badge>
      );
    case "approved":
      return (
        <Badge bg="success">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="me-1"
          />
          Đã duyệt
        </Badge>
      );
    case "rejected":
      return (
        <Badge bg="danger">
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="me-1"
          />
          Từ chối
        </Badge>
      );
    default:
      return status;
  }
};

const AdminReExamRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await reExamRegistrationApi.getAll();
      setRegistrations(res.data.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
    }
    setLoading(false);
  };

  const openModal = (registration) => {
    setSelected(registration);
    setNewStatus(registration.status);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      await reExamRegistrationApi.changeStatus(selected.id, newStatus);
      await fetchData();
      setShowModal(false);
    } catch (err) {
      console.error("Cập nhật trạng thái thất bại:", err);
    }
    setUpdating(false);
  };
  const openDeleteConfirm = (registration) => {
    setSelected(registration);
    setShowConfirmDelete(true);
  };
  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      await reExamRegistrationApi.delete(selected.id);

      // Cập nhật danh sách local thay vì gọi lại API
      setRegistrations((prev) => prev.filter((r) => r.id !== selected.id));

      addToast({
        title: "Thành công",
        message: "Yêu cầu thi lại đã được xóa",
        type: "success",
        duration: 1500,
      });
    } catch (err) {
      console.error("Xoá thất bại:", err);
    }
    setShowConfirmDelete(false);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const filtered = registrations
    .filter((reg) => {
      const keyword = searchText.toLowerCase();
      return (
        reg.student.name.toLowerCase().includes(keyword) ||
        reg.course.title.toLowerCase().includes(keyword)
      );
    })
    .filter((reg) =>
      filterStatus === "all" ? true : reg.status === filterStatus
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue < bValue) return sortAsc ? -1 : 1;
      if (aValue > bValue) return sortAsc ? 1 : -1;
      return 0;
    });

  if (loading)
    return (
      <Loading
        text="Đang tải dữ liệu..."
        size="lg"
        variant="primary"
        textVariant="primary"
      />
    );

  return (
    <div className="admin-reexam">
      <h3 className="admin-reexam__title">Quản lý Đăng ký Thi lại</h3>

      <div className="mb-3 d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <InputGroup style={{ maxWidth: 300 }}>
          <FormControl
            placeholder="Tìm học viên hoặc môn học..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </InputGroup>

        <Form.Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Đang chờ</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </Form.Select>
      </div>

      <div className="table-responsive">
        <Table
          striped
          bordered
          hover
          className="align-middle admin-reexam__table"
        >
          <thead className="table-light text-center">
            <tr>
              <th
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer" }}
              >
                #
                <FontAwesomeIcon
                  icon={
                    sortBy === "id" ? (sortAsc ? faSortUp : faSortDown) : faSort
                  }
                  className="ms-1"
                />
              </th>
              <th>Học viên</th>
              <th>Chương trình</th>
              <th>Môn học</th>
              <th>Lý do</th>
              <th
                onClick={() => handleSort("status")}
                style={{ cursor: "pointer" }}
              >
                Trạng thái
                <FontAwesomeIcon
                  icon={
                    sortBy === "status"
                      ? sortAsc
                        ? faSortUp
                        : faSortDown
                      : faSort
                  }
                  className="ms-1"
                />
              </th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-muted py-4"
                >
                  Không tìm thấy đăng ký thi lại nào.
                </td>
              </tr>
            ) : (
              filtered.map((reg) => (
                <tr key={reg.id}>
                  <td>
                    <Link to={`/admin/re-exam-registrations/${reg.id}`}>
                      #{reg.id}
                    </Link>
                  </td>
                  <td>{reg.student.name}</td>
                  <td>{reg.student_training_program.training_program.name}</td>
                  <td>{reg.course.title}</td>
                  <td>{reg.reason}</td>
                  <td>{renderStatus(reg.status)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openModal(reg)}
                      className="admin-reexam__action-btn"
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="me-1"
                      />
                      Duyệt | Từ chối
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => openDeleteConfirm(reg)}
                      className="admin-reexam__action-btn"
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="me-1"
                      />
                      Xoá
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <p className="text-end mt-2">
        <strong>Tổng:</strong> {filtered.length} đăng ký
      </p>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật trạng thái</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Học viên:</strong> {selected?.student.name}
          </p>
          <p className="mb-3">
            <strong>Môn học:</strong> {selected?.course.title}
          </p>
          <Form.Group controlId="statusSelect">
            <Form.Label>Trạng thái mới</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Đang chờ</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Hủy
          </Button>
          <Button
            variant="success"
            onClick={handleUpdateStatus}
            disabled={updating}
          >
            {updating ? "Đang lưu..." : "Lưu"}
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Xác nhận xoá"
        message={`Bạn có chắc muốn xoá đăng ký thi lại của học viên "${selected?.student.name}" cho môn học "${selected?.course.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </div>
  );
};

export default AdminReExamRegistrations;
