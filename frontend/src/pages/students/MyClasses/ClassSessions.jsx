import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import studentClassApi from "../../../api/studentClassApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import Loading from "../../../components/Common/Loading";

import "../../../styles/student/my-class/class-sessions.css";

const ClassSessions = () => {
  const { classroomId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchedTimes, setWatchedTimes] = useState({});

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await studentClassApi.getSessionsWithLessons(
          classroomId
        );
        if (response.status) {
          setSessions(response.data.data);
        } else {
          console.error("Không tìm thấy buổi học.");
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách buổi học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [classroomId]);

  // Xử lý khi video đang được xem
  const handleTimeUpdate = (e, lessonId) => {
    const currentTime = e.target.currentTime;

    // Cập nhật thời gian đã xem
    setWatchedTimes((prev) => ({
      ...prev,
      [lessonId]: Math.floor(currentTime),
    }));

    // Log thông tin về video và thời gian đã xem
    console.log(
      `Đang xem bài học ${lessonId}: ${Math.floor(currentTime)} giây`
    );
  };

  // Khi video kết thúc
  const handleVideoEnd = (lessonId) => {
    console.log(`✅ Hoàn thành video bài học ${lessonId}`);

    // Log thông tin về thời gian hoàn thành
    if (watchedTimes[lessonId]) {
      console.log(
        `Bài học ${lessonId} đã được xem hoàn thành với thời gian: ${watchedTimes[lessonId]} giây`
      );
    } else {
      console.log(`Bài học ${lessonId} chưa được xem.`);
    }
  };

  if (loading)
    return (
      <Loading
        text="Đang tải buổi học..."
        size="lg"
        variant="danger"
        textVariant="danger"
      />
    );

  return (
    <div className="class-sessions">
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

                      {lesson.video_url && (
                        <a
                          href={lesson.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lesson__link"
                        >
                          🎥 Xem video giới thiệu
                        </a>
                      )}

                      <div className="lesson__documents">
                        {lesson.documents.map((doc, index) => {
                          const fileUrl = getStorageUrl(doc.file_path);
                          const isVideo =
                            doc.file_type === "mp4" || doc.file_type === "webm";

                          return (
                            <div
                              key={index}
                              className="lesson__document"
                            >
                              {isVideo ? (
                                <video
                                  controls
                                  className="lesson__video"
                                  src={fileUrl}
                                  onTimeUpdate={(e) =>
                                    handleTimeUpdate(e, lesson.id)
                                  }
                                  onEnded={() => handleVideoEnd(lesson.id)}
                                >
                                  Trình duyệt không hỗ trợ video.
                                </video>
                              ) : (
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="lesson__download"
                                >
                                  📄 Tải tài liệu ({doc.file_type})
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="lesson__empty">
                    ❌ Buổi học này chưa có bài học nào.
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có buổi học nào.</p>
        )}
      </div>
    </div>
  );
};

export default ClassSessions;
