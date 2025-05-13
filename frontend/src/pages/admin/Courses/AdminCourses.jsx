import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import courseApi from "../../../api/courseApi";
import CourseList from "../../../components/Courses/CourseList";
import CourseModal from "../../../components/Courses/CourseModal";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";
import Loading from "../../../components/Common/Loading";
import "../../../styles/course/admin-courses.css";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    courseId: null,
  });

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchCourses = () => {
    setLoading(true);
    courseApi
      .getCourses()
      .then((res) => {
        setCourses(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách môn học:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setShowCourseModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, courseId: id });
  };

  const confirmDeleteCourse = () => {
    courseApi
      .deleteCourse(confirmDelete.courseId)
      .then(() => {
        addToast({
          title: "Thành công!",
          message: "Môn học đã được xóa.",
          type: "success",
          duration: 3000,
        });
        fetchCourses();
      })
      .catch((err) => {
        addToast({
          title: "Lỗi!",
          message: err.response?.data?.message || "Xóa môn học thất bại.",
          type: "error",
          duration: 3000,
        });
      });
    setConfirmDelete({ isOpen: false, courseId: null });
  };

  const handleSelect = (course) => {
    navigate(`/admin/courses/${course.id}`);
  };

  const handleCourseModalSuccess = () => {
    setShowCourseModal(false);
    addToast({
      title: "Thành công!",
      message: "Thao tác với môn học hoàn tất.",
      type: "success",
      duration: 3000,
    });
    fetchCourses();
  };

  return (
    <div className="admin-courses">
      <div className="admin-courses__header">
        <h2 className="admin-courses__title">Quản lý Môn học</h2>
        <div className="admin-courses__actions">
          <button
            className="admin-courses__btn admin-courses__btn--primary"
            onClick={handleAdd}
          >
            + Thêm môn học
          </button>
        </div>
      </div>
      {loading ? (
        <div>
          <Loading
            text="Đang tải dữ liệu..."
            size="lg"
            variant="primary"
            textVariant="primary"
          />
        </div>
      ) : (
        <CourseList
          subjects={courses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={handleSelect}
        />
      )}
      <CourseModal
        show={showCourseModal}
        handleClose={() => setShowCourseModal(false)}
        initialData={editingCourse}
        onSuccess={handleCourseModalSuccess}
      />

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa môn học này không?"
        onConfirm={confirmDeleteCourse}
        onCancel={() => setConfirmDelete({ isOpen: false, courseId: null })}
      />
    </div>
  );
};

export default AdminCourses;
