import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArrowDown,
  faFilePdf,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";

import studentClassApi from "../../../api/studentClassApi";
import classApi from "../../../api/classApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import Loading from "../../../components/Common/Loading";
import useYouTubeAPI from "../../../hooks/useYouTubeAPI";
import YouTubePlayer from "../../../components/Common/YouTubePlayer";

import "../../../styles/student/my-class/class-sessions.css";

const ClassSessions = () => {
  const { classroomId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchedTimes, setWatchedTimes] = useState({});

  useYouTubeAPI(); // Đảm bảo API YouTube được tải

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classroomRes, sessionsRes] = await Promise.all([
          classApi.getClassById(classroomId),
          studentClassApi.getSessionsWithLessons(classroomId),
        ]);

        if (classroomRes.status) {
          setClassroom(classroomRes.data);
        }

        if (sessionsRes.status) {
          setSessions(sessionsRes.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải lớp học hoặc buổi học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classroomId]);

  const handleTimeUpdate = (e, lessonId) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    const percentageWatched = (currentTime / duration) * 100;

    // Nếu đã hoàn thành rồi thì bỏ qua
    if (watchedTimes[lessonId]?.completed) return;

    // Nếu chưa lưu thì chỉ lưu thời gian
    setWatchedTimes((prev) => ({
      ...prev,
      [lessonId]: {
        time: Math.floor(currentTime),
        completed: prev[lessonId]?.completed || false,
      },
    }));

    // Nếu xem đủ 90% thì đánh dấu hoàn thành
    if (percentageWatched >= 90) {
      setWatchedTimes((prev) => ({
        ...prev,
        [lessonId]: {
          time: Math.floor(currentTime),
          completed: true,
        },
      }));
      console.log(`✅ Bài học ${lessonId} đã được xem đủ 90%`);
      handleVideoEnd(lessonId);
    }
  };

  const handleVideoEnd = (lessonId) => {
    if (!watchedTimes[lessonId]?.completed) {
      console.log(`🎉 Bài học ${lessonId} đã hoàn thành.`);
      setWatchedTimes((prev) => ({
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          completed: true,
        },
      }));
      // Gọi API đánh dấu hoàn thành nếu cần
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  const getYouTubeVideoId = (url) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  };

  if (loading) {
    return (
      <Loading
        text="Đang tải buổi học..."
        size="lg"
        variant="danger"
        textVariant="danger"
      />
    );
  }

  return (
    <div className="class-sessions">
      {classroom && (
        <div className="class-sessions__header">
          <h1 className="class-sessions__class-name">{classroom.name}</h1>
          <p className="class-sessions__class-description">
            {classroom.description}
          </p>

          <div className="class-sessions__course-info">
            <p>
              <strong>Khóa học:</strong> {classroom.course.title}
            </p>
          </div>

          <div className="class-sessions__class-details">
            <p>
              <strong>Ngày bắt đầu:</strong> {formatDate(classroom.start_date)}
            </p>
            <p>
              <strong>Ngày kết thúc:</strong> {formatDate(classroom.end_date)}
            </p>
            <p>
              <strong>Số học viên:</strong> {classroom.current_students}/
              {classroom.max_students}
            </p>
          </div>
        </div>
      )}

      <h2 className="class-sessions__title">Danh sách buổi học</h2>
      <div className="class-sessions__list">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session.id}
              className="session"
            >
              <h3 className="session__title">{session.title}</h3>
              <p className="session__date">📅 {session.date}</p>
              <p className="session__time">
                🕒 {session.start_time} - {session.end_time}
              </p>

              <div className="session__lessons">
                {session.lessons.length > 0 ? (
                  session.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="lesson"
                    >
                      <h4 className="lesson__title">{lesson.title}</h4>
                      <p className="lesson__content">{lesson.content}</p>

                      {/* YouTube Video nếu có */}
                      {lesson.video_url &&
                        getYouTubeVideoId(lesson.video_url) && (
                          <div className="lesson__video-container">
                            <YouTubePlayer
                              videoId={getYouTubeVideoId(lesson.video_url)}
                              lessonId={lesson.id}
                              onComplete={handleVideoEnd}
                            />
                          </div>
                        )}

                      {/* Tài liệu và video bài giảng */}
                      <div className="lesson__documents">
                        {lesson.documents.map((doc, index) => {
                          const fileUrl = getStorageUrl(
                            doc.file_path.replace(/^\/+/, "")
                          ); // Loại bỏ dấu / thừa đầu path
                          const isVideo = ["mp4", "webm"].includes(
                            doc.file_type
                          );

                          let fileIcon = faFileArrowDown;
                          if (doc.file_type === "pdf") fileIcon = faFilePdf;
                          else if (["doc", "docx"].includes(doc.file_type))
                            fileIcon = faFileWord;

                          return (
                            <div
                              key={index}
                              className="lesson__document"
                            >
                              {isVideo ? (
                                <video
                                  controls
                                  onTimeUpdate={(e) =>
                                    handleTimeUpdate(e, lesson.id)
                                  }
                                >
                                  <source
                                    src={fileUrl}
                                    type={`video/${doc.file_type}`}
                                  />
                                </video>
                              ) : (
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="lesson__document-link"
                                >
                                  <FontAwesomeIcon
                                    icon={fileIcon}
                                    className="lesson__document-icon"
                                  />
                                  <span>Xem tài liệu</span>
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Không có bài giảng nào cho buổi học này.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Không có buổi học nào.</p>
        )}
      </div>
    </div>
  );
};

export default ClassSessions;
