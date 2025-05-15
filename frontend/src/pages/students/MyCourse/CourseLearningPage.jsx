import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import studentTrainingApi from "@/api/studentTrainingApi";
import Loading from "@/components/Common/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCalendarAlt,
  faFile,
  faVideo,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import "@/styles/student/my-course/my-course.css";
import { getStorageUrl } from "@/utils/getStorageUrl";
import YouTubePlayer from "@/components/Common/YouTubePlayer";
const CourseLearningPage = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSessions, setExpandedSessions] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return `${formattedTime} ${formattedDate}`;
  };

  const extractYouTubeVideoId = (url) => {
    try {
      const shortRegex = /youtube\.com\/shorts\/([^?&]+)/;
      const watchRegex = /v=([^&]+)/;
      const youtuBeRegex = /youtu\.be\/([^?&]+)/;

      if (shortRegex.test(url)) return url.match(shortRegex)[1];
      if (watchRegex.test(url)) return url.match(watchRegex)[1];
      if (youtuBeRegex.test(url)) return url.match(youtuBeRegex)[1];
    } catch (e) {
      console.warn("Invalid YouTube URL:", e);
    }
    return null;
  };

  const handleSessionToggle = (sessionId) => {
    setExpandedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await studentTrainingApi.getCourseLearningDetail(
          courseId
        );
        if (!response.data || response.data.status === "error") {
          setError("Không thể lấy thông tin môn học.");
          return;
        }
        setCourseDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError("Có lỗi khi tải thông tin môn học.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <Loading
        text="Đang tải ..."
        size="lg"
        variant="primary"
        textVariant="primary"
      />
    );
  }

  if (error) return <div className="error-message">{error}</div>;
  if (!courseDetails) return <div>Không có thông tin môn học.</div>;

  return (
    <div className="course-learning-page container">
      <h2 className="course-learning-page__heading">{courseDetails.title}</h2>
      <p className="course-learning-page__description">
        {courseDetails.description}
      </p>

      <div className="course-learning-page__info row">
        <div className="col-12 col-md-6">
          <strong>Mã môn:</strong> {courseDetails.code}
        </div>
        <div className="col-12 col-md-6">
          <strong>Tín chỉ:</strong> {courseDetails.credits}
        </div>
        <div className="col-12 col-md-6">
          <strong>Tổng giờ:</strong> {courseDetails.total_hours}
        </div>
        <div className="col-12 col-md-6">
          <strong>Lý thuyết:</strong> {courseDetails.theory_hours}
        </div>
        <div className="col-12 col-md-6">
          <strong>Thi:</strong> {courseDetails.exam_hours}
        </div>
      </div>

      {courseDetails.course_sessions.length === 0 ? (
        <div>Chưa có buổi học nào.</div>
      ) : (
        courseDetails.course_sessions.map((session, index) => (
          <div
            key={session.id}
            className="course-learning-page__session mb-4"
          >
            <div className="course-learning-page__session-header">
              <button
                className="course-learning-page__session-toggle-btn"
                onClick={() => handleSessionToggle(session.id)}
              >
                <FontAwesomeIcon
                  icon={
                    expandedSessions.includes(session.id) ? faMinus : faPlus
                  }
                  className="course-learning-page__toggle-icon"
                />
                {expandedSessions.includes(session.id) ? "Ẩn" : "Xem"} buổi học
              </button>
              <h3 className="course-learning-page__session-header-title">
                Buổi {index + 1}: {session.title}
              </h3>
            </div>

            <div className="course-learning-page__session-meta">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span className="mx-1">
                {formatDate(session.start_time)} -{" "}
                {formatDate(session.end_time)}
              </span>
              <span> | Địa điểm: {session.location}</span>
            </div>

            <p>{session.description}</p>

            {expandedSessions.includes(session.id) && (
              <div className="course-learning-page__session-lessons">
                {session.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="course-learning-page__lesson"
                  >
                    <h4 className="course-learning-page__lesson-title">
                      <FontAwesomeIcon icon={faBook} /> {lesson.title}
                    </h4>
                    <p className="course-learning-page__lesson-content">
                      {lesson.content}
                    </p>

                    {lesson.materials.length === 0 ? (
                      <p>Chưa có tài liệu.</p>
                    ) : (
                      <div className="course-learning-page__materials">
                        {lesson.materials.map((material) => {
                          const videoId =
                            material.type === "link"
                              ? extractYouTubeVideoId(material.file_path)
                              : null;

                          return (
                            <div
                              key={material.id}
                              className="course-learning-page__material-item"
                            >
                              {videoId ? (
                                <>
                                  <YouTubePlayer
                                    videoId={videoId}
                                    lessonId={lesson.id}
                                    onComplete={(lessonId) => {
                                      console.log(
                                        `Video cho bài học ${lessonId} đã hoàn thành`
                                      );
                                    }}
                                  />
                                  <span className="course-learning-page__material-type">
                                    <FontAwesomeIcon icon={faVideo} /> Video
                                  </span>
                                </>
                              ) : material.type === "file" ? (
                                <a
                                  href={getStorageUrl(material.file_path)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FontAwesomeIcon icon={faFile} />{" "}
                                  {material.title}
                                </a>
                              ) : (
                                <span>{material.title}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CourseLearningPage;
