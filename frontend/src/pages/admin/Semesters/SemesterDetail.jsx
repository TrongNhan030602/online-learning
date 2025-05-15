import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/useToast";
import semesterApi from "@/api/semesterApi";

import CourseSelectionModal from "@/components/Semester/CourseSelectionModal";
import AddExamScheduleModal from "@/components/ExamSchedule/AddExamScheduleModal";
import ConfirmDialog from "@/components/Common/ConfirmDialog";
import "../../../styles/semester/semester-detail.css";
const SemesterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [semester, setSemester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { addToast } = useToast();
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchSemester = useCallback(async () => {
    try {
      const response = await semesterApi.getSemesterById(id);
      setSemester(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết học kỳ:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSemester();
  }, [fetchSemester]);

  const handleCoursesAdded = () => {
    setShowModal(false);
    fetchSemester();
  };
  const confirmRemoveCourse = async () => {
    if (!courseToDelete) return;
    try {
      await semesterApi.removeCoursesFromSemester(id, [courseToDelete]);
      fetchSemester();
      addToast({
        title: "Thành công!",
        message: "Môn học đã được loại bỏ khỏi học kỳ này.",
        type: "success",
        duration: 1500,
      });
    } catch (error) {
      console.error("Lỗi khi xoá môn:", error);
      addToast({
        title: "Thất bại!",
        message: "Xảy ra lỗi khi xoá môn học. Vui lòng thử lại.",
        type: "error",
        duration: 1500,
      });
    } finally {
      setCourseToDelete(null);
      setShowConfirmDialog(false);
    }
  };

  if (loading)
    return <div className="text-center">Đang tải thông tin học kỳ...</div>;

  if (!semester) return <div>Không tìm thấy học kỳ</div>;

  return (
    <Container className="semester-detail">
      <Row className="semester-detail__header mb-3">
        <Col>
          <Button
            variant="danger"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="me-2"
            />
            Quay lại
          </Button>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="me-2"
            />
            Chọn môn học
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="semester-detail__title">{semester.name}</h2>
          <p>
            <strong>Chương trình đào tạo:</strong>{" "}
            {semester.training_program.name} -{" "}
            <strong>{semester.training_program.code}</strong>
          </p>
          <p>
            <strong>Ghi chú:</strong> {semester.training_program.note}
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <h4>Danh sách môn học</h4>
          {semester.courses.length > 0 ? (
            <Table
              striped
              bordered
              hover
              className="semester-detail__table"
            >
              <thead>
                <tr>
                  <th>Mã MH</th>
                  <th>Tên môn</th>
                  <th>Số tín chỉ</th>
                  <th>Tổng giờ</th>
                  <th>Lý thuyết</th>
                  <th>Thực hành</th>
                  <th>Thi</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {semester.courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.code}</td>
                    <td>
                      <Link
                        to={`/admin/courses/${course.id}`}
                        className="semester-detail__course-link"
                      >
                        {course.title}
                      </Link>
                    </td>
                    <td>{course.credits}</td>
                    <td>{course.total_hours}</td>
                    <td>{course.theory_hours}</td>
                    <td>{course.practice_hours}</td>
                    <td>{course.exam_hours}</td>
                    <td>
                      <div className="semester-detail__course-acctions">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowAddExamModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Thi
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setCourseToDelete(course.id);
                            setShowConfirmDialog(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted fst-italic">
              Học kỳ hiện chưa có môn học nào. Vui lòng chọn môn học để bắt đầu.
            </p>
          )}
        </Col>
      </Row>

      {/* Modal chọn môn học */}
      <CourseSelectionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        semesterId={semester.id}
        trainingProgramId={semester.training_program.id}
        onAdded={handleCoursesAdded}
      />

      <AddExamScheduleModal
        show={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
        trainingProgramId={semester.training_program.id}
        semesterId={semester.id}
        courseId={selectedCourse?.id}
        onSuccess={() => {
          addToast({
            title: "Thành công!",
            message: "Đã thêm lịch thi mới.",
            type: "success",
            duration: 1500,
          });
        }}
      />

      {/* Xác nhận xóa */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá môn học này khỏi học kỳ?"
        onConfirm={confirmRemoveCourse}
        onCancel={() => {
          setShowConfirmDialog(false);
          setCourseToDelete(null);
        }}
      />
    </Container>
  );
};

export default SemesterDetail;
