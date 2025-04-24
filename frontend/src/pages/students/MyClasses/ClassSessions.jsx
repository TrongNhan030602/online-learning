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

import { Container, Row, Col, Card } from "react-bootstrap";

import "../../../styles/student/my-class/class-sessions.css";

const ClassSessions = () => {
  const { classroomId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchedTimes, setWatchedTimes] = useState({});

  useYouTubeAPI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classroomRes, sessionsRes] = await Promise.all([
          classApi.getClassById(classroomId),
          studentClassApi.getSessionsWithLessons(classroomId),
        ]);

        if (classroomRes.status) setClassroom(classroomRes.data);
        if (sessionsRes.status) setSessions(sessionsRes.data.data);
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

    if (watchedTimes[lessonId]?.completed) return;

    setWatchedTimes((prev) => ({
      ...prev,
      [lessonId]: {
        time: Math.floor(currentTime),
        completed: prev[lessonId]?.completed || false,
      },
    }));

    if (percentageWatched >= 90) {
      setWatchedTimes((prev) => ({
        ...prev,
        [lessonId]: {
          time: Math.floor(currentTime),
          completed: true,
        },
      }));
      handleVideoEnd(lessonId);
    }
  };

  const handleVideoEnd = (lessonId) => {
    if (!watchedTimes[lessonId]?.completed) {
      setWatchedTimes((prev) => ({
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          completed: true,
        },
      }));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getYouTubeVideoId = (url) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && (match[1] || match[2]) ? match[1] || match[2] : null;
  };

  if (loading) {
    return (
      <Loading
        text="Đang tải thông tin lớp..."
        size="lg"
        variant="primary"
        textVariant="primary"
      />
    );
  }

  return (
    <Container className="class-sessions">
      {classroom && (
        <div className="class-sessions__header">
          <h1 className="class-sessions__class-name">{classroom.name}</h1>
          <p className="class-sessions__class-description">
            {classroom.description}
          </p>
          <div className="class-sessions__course-info">
            <p>
              <strong>Chương trình:</strong> {classroom.course.title}
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
      <Row className="class-sessions__list">
        {sessions.length > 0 ? (
          sessions.map((session, index) => (
            <Col
              key={session.id}
              md={12}
              className="session"
            >
              <Card className="session__card">
                <Card.Body>
                  <Card.Title className="session__title">
                    Buổi {index + 1}: {session.title}
                  </Card.Title>
                  <Card.Subtitle className="session__date mb-2 text-muted">
                    📅 {formatDate(session.date)} - 🕒 {session.start_time} -{" "}
                    {session.end_time}
                  </Card.Subtitle>
                  <div className="session__lessons">
                    {session.lessons.length > 0 ? (
                      session.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="lesson"
                        >
                          <h4 className="lesson__title">
                            Bài {index + 1}: {lesson.title}
                          </h4>
                          <p className="lesson__content">{lesson.content}</p>
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
                          <div className="lesson__documents">
                            {lesson.documents.map((doc, index) => {
                              const fileUrl = getStorageUrl(
                                doc.file_path.replace(/^\/+/, "")
                              );
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
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Không có buổi học nào.</p>
        )}
      </Row>
    </Container>
  );
};

export default ClassSessions;
