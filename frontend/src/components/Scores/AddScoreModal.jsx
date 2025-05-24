/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
import trainingProgramApi from "@/api/trainingProgramApi";
import semesterApi from "@/api/semesterApi";
import programCourseApi from "@/api/programCourseApi";
import scoreApi from "@/api/scoreApi";

const AddScoreModal = ({
  show,
  handleClose,
  student,
  trainingProgramId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [hasSemesters, setHasSemesters] = useState(false);

  const [semesterId, setSemesterId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [scoreValue, setScoreValue] = useState("");
  const [scoreType, setScoreType] = useState("quiz");
  const [attempt, setAttempt] = useState(1);
  const [isAccepted, setIsAccepted] = useState(true);

  // Reset form mỗi khi modal đóng lại
  useEffect(() => {
    if (!show) {
      setSemesters([]);
      setCourses([]);
      setSemesterId("");
      setCourseId("");
      setScoreValue("");
      setScoreType("quiz");
      setAttempt(1);
      setIsAccepted(true);
      setError(null);
      setLoading(false);
    }
  }, [show]);

  // Lấy thông tin học kỳ hoặc môn học khi mở modal
  useEffect(() => {
    if (!trainingProgramId || !show) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await trainingProgramApi.getSemesters(trainingProgramId);
        const semestersData = res.data.data?.semesters;

        if (Array.isArray(semestersData) && semestersData.length > 0) {
          setSemesters(semestersData);
          setHasSemesters(true);
          setSemesterId(semestersData[0].id);
        } else {
          setHasSemesters(false);
          const coursesRes = await programCourseApi.getCourses(
            trainingProgramId
          );
          const courseList =
            coursesRes.data.data?.courses?.map((item) => item.course) || [];
          setCourses(courseList);
          setCourseId(courseList.length > 0 ? courseList[0].id : "");
        }

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải dữ liệu chương trình.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trainingProgramId, show]);

  // Khi chọn học kỳ thì lấy danh sách môn học theo học kỳ
  useEffect(() => {
    if (!hasSemesters || !semesterId) return;

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await semesterApi.getCoursesBySemester(semesterId);
        const courseList = res.data.data || [];
        setCourses(courseList);
        setCourseId(courseList.length > 0 ? courseList[0].id : "");
        setError(null);
      } catch (err) {
        console.error(err);
        const serverErrorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Lỗi khi nhập điểm.";
        setError(serverErrorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [semesterId, hasSemesters]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId || !scoreValue) {
      setError("Vui lòng chọn môn học và nhập điểm.");
      return;
    }

    const dataToSend = {
      user_id: student.user_id,
      student_training_program_id: student.id,
      course_id: courseId,
      semester_id: hasSemesters ? semesterId : null,
      value: parseFloat(scoreValue),
      score_type: scoreType,
      attempt,
      is_accepted: isAccepted,
    };

    try {
      setLoading(true);
      await scoreApi.createScore(dataToSend);
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error(err);
      const serverErrorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Lỗi khi nhập điểm.";
      setError(serverErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Nhập điểm cho: {student.user.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center mb-3">
            <Spinner animation="border" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && (
          <Form onSubmit={handleSubmit}>
            {hasSemesters && (
              <Form.Group className="mb-3">
                <Form.Label>Học kỳ</Form.Label>
                <Form.Select
                  value={semesterId}
                  onChange={(e) => setSemesterId(e.target.value)}
                  required
                >
                  {semesters.map((semester) => (
                    <option
                      key={semester.id}
                      value={semester.id}
                    >
                      {semester.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Môn học</Form.Label>
              <Form.Select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                required
              >
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.title}
                    </option>
                  ))
                ) : (
                  <option value="">Không có môn học</option>
                )}
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Loại điểm</Form.Label>
                  <Form.Select
                    value={scoreType}
                    onChange={(e) => setScoreType(e.target.value)}
                  >
                    <option value="final">Cuối kỳ</option>
                    <option value="midterm">Giữa kỳ</option>
                    <option value="quiz">Thường xuyên</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Lần thi</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    value={attempt}
                    onChange={(e) => setAttempt(parseInt(e.target.value, 10))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Điểm</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={scoreValue}
                    onChange={(e) => setScoreValue(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col
                md={6}
                className="d-flex align-items-end"
              >
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Chấp nhận điểm"
                    checked={isAccepted}
                    onChange={(e) => setIsAccepted(e.target.checked)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                Nhập điểm
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddScoreModal;
