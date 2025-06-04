import { useEffect, useState } from "react";
import { Button, Table, Form, InputGroup, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faTrashAlt,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/useToast";
import examScheduleApi from "@/api/examScheduleApi";
import Loading from "@/components/common/Loading";
import ExamScheduleModal from "@/components/ExamSchedule/ExamScheduleModal";
import ConfirmDialog from "@/components/Common/ConfirmDialog";
import "../../../styles/exam-schedules/admin-exam-schedules.css";

const AdminExamSchedules = () => {
  const [examSchedules, setExamSchedules] = useState([]); // Dữ liệu lịch thi
  const [filteredSchedules, setFilteredSchedules] = useState([]); // Dữ liệu đã lọc
  const [filters, setFilters] = useState({
    exam_type: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { addToast } = useToast();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Tạo hàm fetchExamSchedules riêng biệt
  const fetchExamSchedules = async () => {
    setLoading(true);
    try {
      const response = await examScheduleApi.getAllExamSchedules();
      setExamSchedules(response.data.data);
      setFilteredSchedules(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch thi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamSchedules();
  }, []);

  useEffect(() => {
    // Khi thay đổi filter hoặc tìm kiếm, ta lọc lại danh sách
    const applyFilters = () => {
      let newFilteredSchedules = [...examSchedules];

      if (filters.exam_type) {
        newFilteredSchedules = newFilteredSchedules.filter(
          (schedule) => schedule.exam_details.exam_type === filters.exam_type
        );
      }

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        newFilteredSchedules = newFilteredSchedules.filter((schedule) => {
          const title = schedule.course.course_title.toLowerCase();
          const code = schedule.course.course_code.toLowerCase();
          return title.includes(lowerQuery) || code.includes(lowerQuery);
        });
      }

      // Sắp xếp dữ liệu nếu có config
      if (sortConfig.key) {
        newFilteredSchedules.sort((a, b) => {
          const aValue =
            sortConfig.key === "exam_date"
              ? new Date(a.exam_details.exam_date)
              : a[sortConfig.key];
          const bValue =
            sortConfig.key === "exam_date"
              ? new Date(b.exam_details.exam_date)
              : b[sortConfig.key];

          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
      }

      setFilteredSchedules(newFilteredSchedules); // Cập nhật dữ liệu đã lọc
    };

    applyFilters(); // Áp dụng bộ lọc
  }, [examSchedules, filters, searchQuery, sortConfig]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditSchedule = (schedule) => {
    // Phẳng hóa dữ liệu trước khi truyền vào modal
    const flatData = {
      exam_id: schedule.exam_id,
      course_id: schedule.course_id ?? schedule.course?.course_id ?? "",
      semester_id: schedule.semester_id ?? schedule.semester?.semester_id ?? "",
      training_program_id:
        schedule.training_program_id ??
        schedule.training_program?.program_id ??
        "",
      exam_type: schedule.exam_details?.exam_type ?? "midterm",
      exam_date: schedule.exam_details?.exam_date ?? "",
      start_time: schedule.exam_details?.start_time ?? "",
      end_time: schedule.exam_details?.end_time ?? "",
      duration_minutes: schedule.exam_details?.duration_minutes ?? "",
      location: schedule.exam_details?.location ?? "",
      note: schedule.exam_details?.note ?? "",
      retake_exam_date: schedule.retake_exam_details?.retake_exam_date ?? "",
      retake_start_time: schedule.retake_exam_details?.retake_start_time ?? "",
      retake_end_time: schedule.retake_exam_details?.retake_end_time ?? "",
    };

    setSelectedSchedule(flatData); // Đưa dữ liệu vào modal
    setShowModal(true); // Hiển thị modal
  };

  const handleModalClose = () => {
    setSelectedSchedule(null); // Đưa dữ liệu vào modal
    setShowModal(false);
  };

  const handleSave = (updatedSchedule) => {
    setShowModal(false);
    setSelectedSchedule(null);

    // Tạo đối tượng mới đúng cấu trúc ban đầu
    const mergedSchedule = {
      ...updatedSchedule, // chứa course_id, exam_id, v.v.
      exam_details: {
        exam_type: updatedSchedule.exam_type,
        exam_date: updatedSchedule.exam_date,
        start_time: updatedSchedule.start_time,
        end_time: updatedSchedule.end_time,
        duration_minutes: updatedSchedule.duration_minutes,
        location: updatedSchedule.location,
        note: updatedSchedule.note,
      },
      retake_exam_details: {
        retake_exam_date: updatedSchedule.retake_exam_date,
        retake_start_time: updatedSchedule.retake_start_time,
        retake_end_time: updatedSchedule.retake_end_time,
      },
    };

    // Cập nhật lại trong state gốc
    setExamSchedules((prev) =>
      prev.map((item) =>
        item.exam_id === updatedSchedule.exam_id
          ? { ...item, ...mergedSchedule }
          : item
      )
    );

    // Cập nhật danh sách lọc (nếu có)
    setFilteredSchedules((prev) =>
      prev.map((item) =>
        item.exam_id === updatedSchedule.exam_id
          ? { ...item, ...mergedSchedule }
          : item
      )
    );
  };
  const confirmDeleteSchedule = async () => {
    try {
      await examScheduleApi.deleteExamSchedule(confirmDeleteId);

      // Cập nhật danh sách sau khi xoá
      setExamSchedules((prev) =>
        prev.filter((schedule) => schedule.exam_id !== confirmDeleteId)
      );
      setFilteredSchedules((prev) =>
        prev.filter((schedule) => schedule.exam_id !== confirmDeleteId)
      );

      setConfirmDeleteId(null);
      addToast({
        title: "Thành công!",
        message: "Lịch thi đã được xóa",
        type: "success",
        duration: 1500,
      });
    } catch (error) {
      console.error("Lỗi khi xoá lịch thi:", error);
      addToast({
        title: "Thất bại!",
        message: "Đã có lỗi xảy ra trong quá trình xóa",
        type: "error",
        duration: 1500,
      });
    }
  };
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === "asc" ? faSortUp : faSortDown;
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeStr) => {
    return timeStr?.slice(0, 5);
  };
  const paginatedData = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  // Nhóm lại sau phân trang
  const groupedByProgram = paginatedData.reduce((groups, item) => {
    const program =
      item.training_program?.program_name +
        " (" +
        item.training_program?.program_code +
        ")" || "Khác";
    if (!groups[program]) groups[program] = [];
    groups[program].push(item);
    return groups;
  }, {});

  return (
    <div className="admin-exam-schedules">
      <h1 className="admin-exam-schedules__title">Quản lý lịch thi</h1>

      <div className="admin-exam-schedules__filters d-flex justify-content-between mb-4">
        <InputGroup className="admin-exam-schedules__search">
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <FormControl
            placeholder="Tìm kiếm theo tên hoặc mã môn"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </InputGroup>
      </div>

      {/* Bộ lọc */}
      <Form className="mb-4">
        <div className="row">
          <div className="col">
            <Form.Group controlId="filterExamType">
              <Form.Label>Loại kỳ thi</Form.Label>
              <Form.Control
                as="select"
                name="exam_type"
                value={filters.exam_type}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="midterm">Giữa kỳ</option>
                <option value="final">Cuối kỳ</option>
              </Form.Control>
            </Form.Group>
          </div>
        </div>
      </Form>

      {/* Bảng danh sách lịch thi */}
      {loading ? (
        <Loading
          text="Đang tải lịch thi..."
          className="my-5"
        />
      ) : filteredSchedules.length === 0 ? (
        <div className="text-center text-muted my-4">
          Không có lịch thi phù hợp
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table
            striped
            bordered
            hover
            className="text-nowrap"
          >
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("exam_id")}
                  style={{ cursor: "pointer" }}
                >
                  ID <FontAwesomeIcon icon={getSortIcon("exam_id")} />
                </th>
                <th>Môn học</th>
                <th>Học kỳ</th>
                <th
                  onClick={() => handleSort("exam_date")}
                  style={{ cursor: "pointer" }}
                >
                  Ngày thi <FontAwesomeIcon icon={getSortIcon("exam_date")} />
                </th>
                <th>Giờ thi</th>
                <th>Địa điểm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            {Object.entries(groupedByProgram).map(
              ([programName, schedules]) => (
                <tbody key={programName}>
                  <tr className="table-secondary">
                    <td colSpan={7}>
                      <strong>{programName}</strong>
                    </td>
                  </tr>
                  {schedules.map((schedule) => (
                    <tr key={schedule.exam_id}>
                      <td className="td-id">
                        <Link
                          to={`/admin/exam-schedules/${schedule.exam_id}`}
                          className="admin-exam-schedules__link"
                        >
                          #{schedule.exam_id}
                        </Link>
                      </td>

                      <td className="td-course">
                        {schedule.course.course_title} (
                        {schedule.course.course_code})
                      </td>
                      <td className="td-semester">
                        {schedule.semester?.semester_name || "N/A"}
                      </td>
                      <td className="td-date">
                        {formatDate(schedule.exam_details.exam_date)}
                      </td>
                      <td className="td-time">
                        {formatTime(schedule.exam_details.start_time)} -{" "}
                        {formatTime(schedule.exam_details.end_time)}
                      </td>
                      <td className="td-location">
                        {schedule.exam_details.location}
                      </td>
                      <td>
                        <div className="admin-exam-schedules__actions">
                          <Button
                            size="sm"
                            className="admin-exam-schedules__action-button"
                            onClick={() => handleEditSchedule(schedule)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            size="sm"
                            className="admin-exam-schedules__action-button admin-exam-schedules__action-button--delete"
                            onClick={() => setConfirmDeleteId(schedule.exam_id)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )
            )}
          </Table>
        </div>
      )}
      <div className="d-flex justify-content-end align-items-center mt-3">
        <Button
          variant="outline-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="me-2"
        >
          Trang trước
        </Button>

        <span className="mx-2">
          Trang {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline-primary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Trang sau
        </Button>
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Xác nhận xoá lịch thi"
        message="Bạn có chắc chắn muốn xoá lịch thi này không? Hành động này không thể hoàn tác."
        onConfirm={confirmDeleteSchedule}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <ExamScheduleModal
        show={showModal}
        onClose={handleModalClose}
        scheduleData={selectedSchedule}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminExamSchedules;
