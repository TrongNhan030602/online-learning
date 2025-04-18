import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import trainingProgramApi from "../../../api/trainingProgramApi";
import lessonApi from "../../../api/lessonApi";
import classApi from "../../../api/classApi";
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
        // Lấy danh sách chương trình đào tạo
        const programResponse = await trainingProgramApi.getByCourseId(id);
        setTrainingPrograms(programResponse.data);

        // Lấy danh sách bài học
        const lessonResponse = await lessonApi.getLessons({ course_id: id });
        setLessons(lessonResponse.data);

        // Lấy danh sách lớp học
        const classResponse = await classApi.getClassesByCourse(id);
        setClasses(classResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError("Lỗi khi lấy dữ liệu.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Hàm mở modal khi click vào icon con mắt
  const handleViewClassDetails = (classId) => {
    setSelectedClassId(classId);
    setShowModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClassId(null);
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="course-detail">
      <h1 className="course-detail__title">Chi tiết khóa học</h1>

      {/* Hiển thị chương trình đào tạo */}
      <section className="course-detail__section training-programs">
        <h2 className="training-programs__title">Các chương trình đào tạo</h2>
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

      {/* Hiển thị danh sách lớp học */}
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
                Thời gian: {new Date(classItem.start_date).toLocaleDateString()}{" "}
                - {new Date(classItem.end_date).toLocaleDateString()}
              </p>
              <p className="class-card__students">
                Số học viên: {classItem.current_students}/
                {classItem.max_students}
              </p>
              <p className="class-card__status">
                Trạng thái:
                <span
                  className={`class-card__status-label class-card__status-label--${classItem.status}`}
                >
                  {classItem.status === "open" ? "Mở" : "Đóng"}
                </span>
              </p>

              {/* Icon con mắt để xem chi tiết lớp học */}
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

      {/* Hiển thị Modal với buổi học */}
      <SessionModal
        showModal={showModal}
        handleClose={handleCloseModal}
        classId={selectedClassId} // Truyền classId vào modal
      />

      {/* Hiển thị danh sách bài học */}
      <section className="course-detail__section lessons">
        <h2 className="lessons__title">Danh sách bài học</h2>
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="lesson-card"
            >
              <h3 className="lesson-card__title">{lesson.title}</h3>
              <p className="lesson-card__content">{lesson.content}</p>

              {/* Hiển thị video bài học nếu có */}
              {lesson.video_url && (
                <div className="lesson-video">
                  <a
                    href={lesson.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lesson-video__link"
                  >
                    Xem video giới thiệu
                  </a>
                </div>
              )}
            </div>
          ))
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
