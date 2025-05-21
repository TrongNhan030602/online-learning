import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Table, Spinner, Alert, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faTrash,
  faArrowLeft,
  faPlus,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/useToast";
import studentTrainingProgramApi from "@/api/studentTrainingProgramApi";
import AddStudentModal from "@/components/StudentTrainingPrograms/AddStudentModal";
import AddScoreModal from "@/components/Scores/AddScoreModal";

import ConfirmDialog from "@/components/Common/ConfirmDialog";
import "../../../styles/trainingPrograms/program-students-page.css";

const ProgramStudentsPage = () => {
  const { programId } = useParams();
  const [students, setStudents] = useState([]);
  const [programName, setProgramName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedStudentToRemove, setSelectedStudentToRemove] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedStudentForScore, setSelectedStudentForScore] = useState(null);

  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm
  const [sortColumn, setSortColumn] = useState("user_id"); // Mặc định sắp xếp theo ID
  const [sortOrder, setSortOrder] = useState("asc"); // Mặc định sắp xếp tăng dần
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await studentTrainingProgramApi.getStudentsInProgram(
          programId
        );
        const data = response.data.data;

        setStudents(data);
        setError(null); // Xóa lỗi nếu có

        if (data.length > 0) {
          setProgramName(data[0].training_program.name);
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi lấy danh sách học viên.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [programId]);

  // Hàm format loại nhập học
  const formatEntryType = (entryType) => {
    switch (entryType) {
      case "lien_thong":
        return "Liên thông";
      case "default":
        return "Chính quy";
      case "van_bang_2":
        return "Văn bằng 2";
      default:
        return entryType;
    }
  };

  // Hàm tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Hàm sắp xếp
  const handleSort = (column) => {
    const newOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newOrder);
  };

  // Lọc và sắp xếp học viên
  const filteredStudents = students
    .filter((student) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        student.user?.name.toLowerCase().includes(searchLower) ||
        student.user?.email.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const valA = a[sortColumn] || "";
      const valB = b[sortColumn] || "";

      if (sortOrder === "asc") {
        return valA < valB ? -1 : 1;
      } else {
        return valA > valB ? -1 : 1;
      }
    });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const openConfirmDialog = (studentId) => {
    setSelectedStudentToRemove(studentId);
    setShowConfirmDialog(true);
  };

  const handleAddStudentSuccess = () => {
    const fetchStudents = async () => {
      try {
        const response = await studentTrainingProgramApi.getStudentsInProgram(
          programId
        );
        setStudents(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi lấy danh sách học viên.");
      }
    };

    fetchStudents();
    setShowModal(false); // Đóng modal sau khi thêm học viên
  };

  const confirmRemoveStudent = async () => {
    try {
      await studentTrainingProgramApi.removeStudentFromProgram(
        selectedStudentToRemove,
        programId
      );

      const response = await studentTrainingProgramApi.getStudentsInProgram(
        programId
      );
      addToast({
        title: "Thành công!",
        message: "Học viên này đã được loại bỏ",
        type: "success",
        duration: 1500,
      });
      setStudents(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi xóa học viên.");
    } finally {
      setShowConfirmDialog(false);
      setSelectedStudentToRemove(null);
    }
  };
  const handleShowScoreModal = (student) => {
    setSelectedStudentForScore(student);
    setShowScoreModal(true);
  };
  const handleCloseScoreModal = () => {
    setShowScoreModal(false);
    setSelectedStudentForScore(null);
  };

  if (loading) {
    return (
      <div className="program-students__loading text-center">
        <Spinner animation="border" />
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="danger"
        className="program-students__error"
      >
        <FontAwesomeIcon icon={faExclamationCircle} /> {error}
      </Alert>
    );
  }

  return (
    <div className="program-students">
      <div className="program-students__header d-flex justify-content-between align-items-center mb-3">
        <h1 className="program-students__title">Học viên: {programName}</h1>
        <div className="program-students__actions">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="program-students__btn program-students__btn--back me-2"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="me-1"
            />
            Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={handleShowModal}
            className="program-students__btn program-students__btn--add"
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="me-1"
            />
            Thêm học viên
          </Button>
        </div>
      </div>

      {/* Thêm Form Tìm Kiếm */}
      <div className="program-students__search mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm học viên theo tên hoặc email"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Hiển thị bảng học viên hoặc thông báo nếu không có học viên */}
      {students.length > 0 ? (
        <Table
          striped
          bordered
          hover
          className="program-students__table"
        >
          <thead>
            <tr>
              <th
                onClick={() => handleSort("user_id")}
                className="program-students__table-td--sort"
              >
                ID{" "}
                {sortColumn === "user_id" && (
                  <FontAwesomeIcon
                    icon={sortOrder === "asc" ? faArrowUp : faArrowDown}
                    className="ms-2"
                  />
                )}
              </th>
              <th
                onClick={() => handleSort("student.name")}
                className="program-students__table-td--sort"
              >
                MSSV{" "}
                {sortColumn === "student.name" && (
                  <FontAwesomeIcon
                    icon={sortOrder === "asc" ? faArrowUp : faArrowDown}
                    className="ms-2"
                  />
                )}
              </th>
              <th
                onClick={() => handleSort("student.email")}
                className="program-students__table-td--sort"
              >
                Email{" "}
                {sortColumn === "student.email" && (
                  <FontAwesomeIcon
                    icon={sortOrder === "asc" ? faArrowUp : faArrowDown}
                    className="ms-2"
                  />
                )}
              </th>
              <th>Loại nhập học</th>
              <th>Chương trình đào tạo</th>
              <th>Chương trình đào tạo trước</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.user_id}>
                <td>{student.user_id}</td>
                <td>
                  <Link
                    to={`/admin/users/${student.user_id}`}
                    className="program-students__link"
                  >
                    {student.user.name}
                  </Link>
                </td>
                <td>{student.user.email}</td>
                <td>{formatEntryType(student.entry_type)}</td>
                <td>
                  {student.training_program
                    ? student.training_program.name
                    : "Không có"}
                </td>
                <td>
                  {student.from_program
                    ? student.from_program.name
                    : "Không có"}
                </td>
                <td>
                  {" "}
                  <Button
                    variant="primary"
                    size="sm"
                    title="Nhập điểm học tập"
                    className="me-2 mb-1"
                    onClick={() => handleShowScoreModal(student)}
                  >
                    <FontAwesomeIcon icon={faPlus} /> N.Điểm
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    title="Xóa học viên khỏi chương trình này"
                    onClick={() => openConfirmDialog(student.user_id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="program-students__no-students text-center">
          <p>Chưa có học viên trong chương trình này.</p>
          <Button
            variant="primary"
            onClick={handleShowModal}
            className="mt-3"
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="me-2"
            />
            Thêm học viên
          </Button>
        </div>
      )}

      {/* Modal và Confirm Dialog */}
      <AddStudentModal
        programId={programId}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleAddStudentSuccess={handleAddStudentSuccess}
      />
      {/* Modal nhập điểm */}
      {selectedStudentForScore && (
        <AddScoreModal
          show={showScoreModal}
          handleClose={handleCloseScoreModal}
          student={selectedStudentForScore}
          trainingProgramId={programId}
          onSuccess={() =>
            addToast({
              title: "Thành công!",
              message: "Điểm đã được nhập",
              type: "success",
              duration: 1500,
            })
          }
        />
      )}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa học viên này khỏi chương trình?"
        onConfirm={confirmRemoveStudent}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  );
};

export default ProgramStudentsPage;
