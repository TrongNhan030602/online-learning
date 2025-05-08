/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { Modal, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import semesterApi from "../../api/semesterApi";
import { useToast } from "../../hooks/useToast";

const CourseSelectionModal = ({
  show,
  onClose,
  semesterId,
  trainingProgramId,
  onAdded,
}) => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await semesterApi.getCoursesNotInSemester(trainingProgramId);
      const data = res.data.data;
      setAvailableCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      setError("Lỗi khi lấy danh sách môn học. Vui lòng thử lại.");
      console.error("Lỗi khi lấy danh sách môn học:", err);
    } finally {
      setLoading(false);
    }
  }, [trainingProgramId]);

  useEffect(() => {
    if (show) {
      fetchCourses();
      setSearchTerm("");
      setSelectedCourseIds([]);
    }
  }, [show, fetchCourses]);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = availableCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerSearch) ||
        course.code.toLowerCase().includes(lowerSearch)
    );
    setFilteredCourses(filtered);
  }, [searchTerm, availableCourses]);

  const toggleCourse = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleAddCourses = async () => {
    if (selectedCourseIds.length === 0) return;
    try {
      await semesterApi.addCoursesToSemester(semesterId, selectedCourseIds);
      onAdded();
      onClose();
      addToast({
        title: "Thành công!",
        message: "Môn học đã được thêm vào học kỳ này.",
        type: "success",
        duration: 1500,
      });
    } catch (err) {
      setError("Lỗi khi thêm môn học. Vui lòng thử lại.");
      console.error("Lỗi khi thêm môn học:", err);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>Chọn môn học cho học kỳ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : availableCourses.length === 0 ? (
          <p className="text-muted text-center">
            Không còn môn học nào để chọn.
          </p>
        ) : (
          <>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã môn học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <div className="course-list">
              {filteredCourses.map((course) => {
                const isChecked = selectedCourseIds.includes(course.id);
                return (
                  <div
                    key={course.id}
                    className={`course-item p-3 mb-2 border rounded d-flex justify-content-between align-items-center ${
                      isChecked ? "selected" : ""
                    }`}
                    onClick={() => toggleCourse(course.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div>
                      <div className="fw-bold">{course.title}</div>
                      <div className="text-muted small">
                        {course.code} • {course.credits} tín chỉ
                      </div>
                    </div>
                    <Form.Check
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCourse(course.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                );
              })}
              {filteredCourses.length === 0 && (
                <p className="text-muted text-center">
                  Không tìm thấy môn học phù hợp.
                </p>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onClose}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleAddCourses}
          disabled={selectedCourseIds.length === 0}
        >
          Thêm vào học kỳ ({selectedCourseIds.length})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CourseSelectionModal;
