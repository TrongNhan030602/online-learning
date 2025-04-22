import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import trainingProgramApi from "../../../api/trainingProgramApi";
import lessonApi from "../../../api/lessonApi";
import classApi from "../../../api/classApi";
import { Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import SessionModal from "../Sessions/SessionsModal";
import "../../../styles/student/courses/course-detail.css";

const CourseDetail = () => {
  const { id } = useParams();
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const programResponse = await trainingProgramApi.getByCourseId(id);
        setTrainingPrograms(programResponse.data);

        const lessonResponse = await lessonApi.getLessons({ course_id: id });
        setLessons(lessonResponse.data);

        const classResponse = await classApi.getClassesByCourse(id);
        setClasses(classResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError("Không thể kết nối với máy chủ. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleViewClassDetails = (classId) => {
    setSelectedClassId(classId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClassId(null);
  };

  if (loading)
    return <div className="loading-spinner">Đang tải dữ liệu...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="course-detail">
      <h1 className="course-detail__title">Chi tiết khóa học</h1>

      <section className="course-detail__section training-programs">
        <h2 className="training-programs__title">
          Chương trình đào tạo của khóa
        </h2>
        {trainingPrograms.length > 0 ? (
          trainingPrograms.map((program) => (
            <div
              key={program.id}
              className="training-program-card"
            >
              <h3 className="training-program-card__title">{program.name}</h3>
              <p className="training-program-card__description">
                {program.description}
              </p>
              <p className="training-program-card__duration">
                Thời gian: {program.duration} tháng
              </p>
              <p className="training-program-card__requirements">
                Yêu cầu: {program.requirements}
              </p>
              <p className="training-program-card__objectives">
                Mục tiêu: {program.objectives}
              </p>
            </div>
          ))
        ) : (
          <p className="training-programs__message">
            Không có chương trình đào tạo nào.
          </p>
        )}
      </section>

      <section className="course-detail__section classes">
        <h2 className="classes__title">Danh sách lớp học</h2>
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <div
              key={classItem.id}
              className="class-card"
            >
              <h3 className="class-card__name">{classItem.name}</h3>
              <p className="class-card__date">
                Thời gian:{" "}
                {new Date(classItem.start_date).toLocaleDateString("en-GB")} -{" "}
                {new Date(classItem.end_date).toLocaleDateString("en-GB")}
              </p>
              <p className="class-card__students">
                Số học viên: {classItem.current_students}/
                {classItem.max_students}
              </p>
              <p className="class-card__status">
                Trạng thái:{" "}
                <span
                  className={`class-card__status-label class-card__status-label--${classItem.status}`}
                >
                  {classItem.status === "open" ? "Mở" : "Đóng"}
                </span>
              </p>
              <button
                className="class-card__view-btn"
                onClick={() => handleViewClassDetails(classItem.id)}
              >
                <FontAwesomeIcon icon={faEye} /> Xem buổi học
              </button>
            </div>
          ))
        ) : (
          <p className="classes__message">
            Không có lớp học nào cho khóa học này.
          </p>
        )}
      </section>

      <SessionModal
        showModal={showModal}
        handleClose={handleCloseModal}
        classId={selectedClassId}
      />

      <section className="course-detail__section lessons">
        <h2 className="lessons__title">Danh sách bài học</h2>
        {lessons.length > 0 ? (
          <Accordion>
            {lessons.map((lesson, index) => (
              <Accordion.Item
                eventKey={index.toString()}
                key={lesson.id}
              >
                <Accordion.Header>
                  <span className="lesson-index">Bài {index + 1}:</span>{" "}
                  {lesson.title}
                </Accordion.Header>

                <Accordion.Body>
                  <p>{lesson.content}</p>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <p className="lessons__message">
            Không có bài học nào cho khóa học này.
          </p>
        )}
      </section>
    </div>
  );
};

export default CourseDetail;
