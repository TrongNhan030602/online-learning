import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import classApi from "../../../api/classApi";
import sessionApi from "../../../api/sessionApi";
import enrollmentApi from "../../../api/enrollmentApi";
import { useToast } from "../../../hooks/useToast";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";
import AddSessionModal from "../../../components/Sessions/AddSessionModal";
import EditSessionModal from "../../../components/Sessions/EditSessionModal";
import AddLessonModal from "../../../components/Sessions/AddLessonModal";
import DeleteLessonModal from "../../../components/Sessions/DeleteLessonModal";
import AddStudentModal from "../../../components/DisciplineScores/AddStudentModal";

import "../../../styles/classes/class-detail.css";

const DisciplineScoresDetail = () => {
  const { addToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [selectedSessionForLesson, setSelectedSessionForLesson] =
    useState(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);
  const [sessionForDeletingLesson, setSessionForDeletingLesson] =
    useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  useEffect(() => {
    classApi
      .getClassById(id)
      .then((res) => {
        setClassData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết lớp học:", err);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateStr) => dayjs(dateStr).format("DD/MM/YYYY");
  const formatTime = (timeStr) => timeStr?.substring(0, 5);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Cập nhật lại danh sách buổi học khi thêm mới và hiển thị thông báo thành công
  const handleSessionAdded = (newSession) => {
    setClassData((prevData) => ({
      ...prevData,
      sessions: [...prevData.sessions, newSession],
    }));

    addToast({
      title: "Thành công!",
      message: "Buổi học đã được thêm.",
      type: "success",
      duration: 2000,
    });
  };

  // Mở modal chỉnh sửa buổi học
  const handleEditSession = (session) => {
    setSelectedSession(session);
    setIsEditModalOpen(true);
  };

  // Mở modal xác nhận xóa buổi học
  const handleDeleteSession = (session) => {
    setSelectedSession(session);
    setIsDeleteModalOpen(true); // Mở modal xác nhận
  };
  // Mở modal xóa bài học
  const handleDeleteLesson = (session) => {
    setSessionForDeletingLesson(session);
    setIsDeleteLessonModalOpen(true);
  };

  // Xử lý xóa buổi học khi xác nhận
  const handleConfirmDeleteSession = async () => {
    try {
      await sessionApi.deleteSession(id, selectedSession.id);

      // Cập nhật lại danh sách buổi học sau khi xóa
      setClassData((prevData) => ({
        ...prevData,
        sessions: prevData.sessions.filter(
          (session) => session.id !== selectedSession.id
        ),
      }));
      addToast({
        title: "Thành công!",
        message: "Buổi học đã được xóa.",
        type: "success",
        duration: 3000,
      });
      // Đóng modal sau khi xóa
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi xóa buổi học:", error);
    }
  };
  const handleAddLesson = (session) => {
    setSelectedSessionForLesson(session);
    setIsLessonModalOpen(true);
  };
  const handleDeleteEnrollment = (enrollmentId) => {
    // Mở ConfirmDialog với thông điệp xác nhận xóa học viên
    setShowConfirmDialog({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xoá học viên này khỏi lớp?",
      onConfirm: async () => {
        try {
          // Gọi API xóa học viên
          await enrollmentApi.remove(enrollmentId);

          // Cập nhật lại danh sách học viên sau khi xóa
          setClassData((prevData) => ({
            ...prevData,
            students: prevData.students.filter(
              (student) => student.pivot.id !== enrollmentId
            ),
          }));

          addToast({
            title: "Thành công!",
            message: "Học viên đã được xóa khỏi lớp.",
            type: "success",
            duration: 3000,
          });
        } catch (error) {
          console.error("Lỗi khi xóa học viên:", error);
          addToast({
            title: "Thất bại!",
            message: "Không thể xóa học viên. Thử lại sau.",
            type: "error",
            duration: 3000,
          });
        }
        // Đóng ConfirmDialog sau khi xóa
        setShowConfirmDialog({ isOpen: false });
      },
      onCancel: () => {
        // Đóng ConfirmDialog nếu người dùng từ chối
        setShowConfirmDialog({ isOpen: false });
      },
    });
  };

  if (loading) return <div className="class-detail__loading">Đang tải...</div>;
  if (!classData)
    return <div className="class-detail__error">Không tìm thấy lớp học.</div>;

  const {
    name,
    max_students,
    status,
    start_date,
    end_date,
    course,
    students,
    sessions,
  } = classData;
  const reloadClassData = () => {
    classApi
      .getClassById(id)
      .then((res) => setClassData(res.data))
      .catch((err) =>
        console.error("Lỗi khi reload lớp học sau khi cập nhật bài học:", err)
      );
  };

  return (
    <div className="class-detail">
      <button
        className="class-detail__back-btn"
        onClick={() => navigate(-1)}
      >
        Quay lại
      </button>

      <h1 className="class-detail__title">{name}</h1>

      <div className="class-detail__section class-detail__info">
        <p>
          <strong>Khóa học:</strong> {course?.title}
        </p>
        {course?.image_url && (
          <img
            src={getStorageUrl(course.image_url)}
            alt={course.title}
            className="class-detail__course-img"
          />
        )}
        <p>
          <strong>Trạng thái:</strong> {status}
        </p>
        <p>
          <strong>Thời gian:</strong> {formatDate(start_date)} →{" "}
          {formatDate(end_date)}
        </p>
        <p>
          <strong>Sĩ số:</strong> {students?.length}/{max_students}
        </p>
      </div>

      <div className="class-detail__section">
        <div className="class-detail__header">
          <h2 className="class-detail__subtitle">
            Danh sách học viên ({students?.length || 0})
          </h2>
          <button
            className="class-detail__add-btn"
            onClick={() => setShowAddStudentModal(true)}
            title="Thêm học viên"
          >
            <FontAwesomeIcon icon={faUserPlus} /> Thêm
          </button>
        </div>

        {students?.length > 0 ? (
          <ul className="class-detail__list">
            {students.map((s) => (
              <li
                key={s.id}
                className="class-detail__student"
              >
                👤 {s.name} - {s.email}
                {/* Button xóa học viên */}
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDeleteEnrollment(s.pivot.id)} // Gọi hàm xoá với pivot.id
                  title="Xoá học viên"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có học viên trong lớp học này.</p>
        )}
      </div>

      <div className="class-detail__section">
        <div className="class-detail__header">
          <h2 className="class-detail__subtitle">
            Lịch học ({sessions?.length || 0})
          </h2>
          <button
            onClick={toggleModal}
            className="class-detail__add-btn"
          >
            Thêm buổi học
          </button>
        </div>
        {sessions?.length > 0 ? (
          <table className="class-detail__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ngày học</th>
                <th>Tiêu đề</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session, index) => (
                <tr
                  key={session.id}
                  className="class-detail__table-row"
                >
                  <td>{index + 1}</td>
                  <td>{formatDate(session.session_date)}</td>
                  <td>{session.title}</td>
                  <td>
                    {formatTime(session.start_time)} →{" "}
                    {formatTime(session.end_time)}
                  </td>
                  <td className="class-detail__table-actions">
                    <button
                      className="class-detail__action-btn class-detail__action-btn--edit"
                      onClick={() => handleEditSession(session)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="class-detail__action-btn class-detail__action-btn--delete"
                      onClick={() => handleDeleteSession(session)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className="class-detail__action-btn class-detail__action-btn--add-lesson"
                      onClick={() => handleAddLesson(session)}
                      title="Thêm bài học"
                    >
                      ➕
                    </button>
                    <button
                      className="class-detail__action-btn class-detail__action-btn--delete-lesson"
                      onClick={() => handleDeleteLesson(session)}
                      title="Xóa bài học"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có lịch học cho lớp này.</p>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Xóa buổi học"
        message="Bạn chắc chắn muốn xóa buổi học này?"
        onConfirm={handleConfirmDeleteSession}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      <ConfirmDialog
        isOpen={showConfirmDialog.isOpen}
        title="Xoá học viên"
        message={showConfirmDialog.message}
        onConfirm={showConfirmDialog.onConfirm}
        onCancel={showConfirmDialog.onCancel}
      />

      {/* Modal để thêm buổi học */}
      <AddSessionModal
        show={isModalOpen}
        handleClose={toggleModal}
        classId={id}
        onSessionAdded={handleSessionAdded}
      />

      {/* Modal để chỉnh sửa buổi học */}
      <EditSessionModal
        show={isEditModalOpen}
        handleClose={() => setIsEditModalOpen(false)}
        session={selectedSession}
        classroomId={id}
        onSessionUpdated={(updatedSession) => {
          setClassData((prevData) => ({
            ...prevData,
            sessions: prevData.sessions.map((s) =>
              s.id === updatedSession.id ? updatedSession : s
            ),
          }));
        }}
      />

      <AddLessonModal
        show={isLessonModalOpen}
        handleClose={() => setIsLessonModalOpen(false)}
        session={selectedSessionForLesson}
        onLessonAdded={() => {
          reloadClassData();
          addToast({
            title: "Thành công!",
            message: "Đã thêm bài học vào buổi học.",
            type: "success",
            duration: 2000,
          });
        }}
      />

      {/* Modal để xóa bài học */}
      <DeleteLessonModal
        show={isDeleteLessonModalOpen}
        handleClose={() => setIsDeleteLessonModalOpen(false)}
        session={sessionForDeletingLesson}
        onLessonDeleted={() => {
          reloadClassData();
          addToast({
            title: "Thành công!",
            message: "Đã xóa bài học khỏi buổi học.",
            type: "success",
            duration: 2000,
          });
          setSessionForDeletingLesson(null);

          // Đóng modal sau khi xóa
          setIsDeleteLessonModalOpen(false);
        }}
      />

      {/* Modal để thêm học viên */}
      <AddStudentModal
        show={showAddStudentModal}
        handleClose={() => setShowAddStudentModal(false)}
        classroomId={id}
        onStudentAdded={reloadClassData}
        enrolledStudents={students}
      />
    </div>
  );
};

export default DisciplineScoresDetail;
