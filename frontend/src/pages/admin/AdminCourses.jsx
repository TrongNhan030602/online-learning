// src/pages/admin/AdminCourses.jsx
import { useState, useEffect } from "react";
import courseApi from "../../api/courseApi";
import CourseList from "../../components/Courses/CourseList";
import CourseModal from "../../components/Courses/CourseModal";
import "../../styles/course/admin-courses.css";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCourses = () => {
    courseApi
      .getCourses()
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khóa học này không?")) {
      courseApi
        .deleteCourse(id)
        .then(() => {
          setMessage("Khóa học đã được xóa thành công.");
          fetchCourses();
        })
        .catch((err) =>
          setMessage(err.response?.data?.message || "Xóa khóa học thất bại.")
        );
    }
  };

  const handleFormSuccess = () => {
    setMessage("Thao tác thành công.");
    fetchCourses();
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="admin__content">
      <h2>Quản lý Khóa học</h2>
      {message && <p className="admin__message">{message}</p>}
      <button
        className="admin__btn admin__btn--primary"
        onClick={handleAdd}
      >
        + Thêm
      </button>
      <CourseList
        courses={courses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={(course) => console.log("Selected course:", course)}
      />
      <CourseModal
        show={showModal}
        handleClose={handleModalClose}
        initialData={editingCourse}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default AdminCourses;
