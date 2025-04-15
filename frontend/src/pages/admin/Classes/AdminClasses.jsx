import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import classApi from "../../../api/classApi";
import courseApi from "../../../api/courseApi";
import ClassList from "../../../components/Classes/ClassList";
import ClassModal from "../../../components/Classes/ClassModal";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";
import Loading from "../../../components/Common/Loading";
import "../../../styles/classes/admin-classes.css";

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]); // Lưu danh sách khóa học
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    classId: null,
  });

  const { addToast } = useToast();

  // Fetch danh sách lớp học (khóa học đã có trong lớp học)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const classRes = await classApi.getAllClasses(); // Lấy danh sách lớp học
        const classData = classRes.data;
        setClasses(Array.isArray(classData) ? classData : []);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu lớp học:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch danh sách khóa học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRes = await courseApi.getCourses();
        setCourses(coursesRes.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", err);
      }
    };

    fetchCourses();
  }, []);

  const handleAdd = () => {
    setEditingClass(null);
    setShowClassModal(true);
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setShowClassModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, classId: id });
  };

  const confirmDeleteClass = () => {
    classApi.deleteClass(confirmDelete.classId).then(() => {
      addToast({
        title: "Thành công!",
        message: "Lớp học đã được xóa.",
        type: "success",
        duration: 3000,
      });
      setConfirmDelete({ isOpen: false, classId: null });
      setClasses(
        classes.filter((classItem) => classItem.id !== confirmDelete.classId)
      );
    });
  };

  return (
    <div className="admin-classes">
      <div className="admin-classes__header">
        <h2 className="classes-faqs__title">Quản lý lớp học</h2>
        <div className="admin-classes__actions">
          <button
            className="admin-classes__btn admin-classes__btn--primary"
            onClick={handleAdd}
          >
            + Thêm lớp học
          </button>
        </div>
      </div>

      {loading ? (
        <Loading
          text="Đang tải dữ liệu..."
          size="lg"
          variant="danger"
          textVariant="danger"
        />
      ) : (
        <ClassList
          classes={classes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ClassModal
        show={showClassModal}
        handleClose={() => setShowClassModal(false)}
        initialData={editingClass}
        courses={courses || []}
        onSuccess={() => {
          setLoading(true);
          classApi
            .getAllClasses()
            .then((res) => {
              const data = res.data;
              setClasses(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
              console.error("Lỗi khi lấy danh sách lớp học:", err);
            })
            .finally(() => setLoading(false));
        }}
      />

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa lớp học này không?"
        onConfirm={confirmDeleteClass}
        onCancel={() => setConfirmDelete({ isOpen: false, classId: null })}
      />
    </div>
  );
};

export default AdminClasses;
