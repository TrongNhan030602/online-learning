/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Row, Col, Card, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import programCourseApi from "@/api/programCourseApi";
import { useToast } from "@/hooks/useToast";

const CourseSelectorModal = ({ show, onHide, trainingProgramId, onSave }) => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    if (!show) return;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await programCourseApi.getAvailableCourses(
          trainingProgramId
        );
        setAvailableCourses(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách môn học:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [show, trainingProgramId]);

  const handleToggleCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async () => {
    try {
      await programCourseApi.assignCourses({
        training_program_id: trainingProgramId,
        courses: selectedCourses,
      });
      addToast({
        title: "Thành công!",
        message: "Môn học đã được thêm.",
        type: "success",
        duration: 1500,
      });
      onSave();
      onHide();
    } catch (error) {
      console.error("Lỗi khi gán môn học:", error);
    }
  };

  const filteredCourses = availableCourses.filter((course) =>
    `${course.title} ${course.code}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon
            icon={faBookOpen}
            className="me-2 text-primary"
          />
          Chọn môn học cho chương trình
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" />
          </div>
        ) : availableCourses.length === 0 ? (
          <p className="text-muted text-center">
            Không còn môn học nào để gán.
          </p>
        ) : (
          <>
            <Form.Control
              type="text"
              placeholder="Tìm theo tên hoặc mã môn học..."
              className="mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Row
              xs={1}
              md={2}
            >
              {filteredCourses.map((course) => {
                const isChecked = selectedCourses.includes(course.id);
                return (
                  <Col
                    key={course.id}
                    className="mb-3"
                  >
                    <Card
                      className={`shadow-sm h-100 border ${
                        isChecked ? "border-primary" : "border-light"
                      }`}
                      onClick={() => handleToggleCourse(course.id)}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        backgroundColor: isChecked ? "#f0f8ff" : "#fff",
                      }}
                    >
                      <Card.Body className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Title className="mb-1">
                            {course.title}
                          </Card.Title>
                          <Card.Subtitle className="text-muted">
                            {course.code} • {course.credits} tín chỉ
                          </Card.Subtitle>
                        </div>
                        {isChecked && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-success mt-1"
                            size="lg"
                          />
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onHide}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={selectedCourses.length === 0}
        >
          Thêm vào chương trình ({selectedCourses.length})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CourseSelectorModal;
