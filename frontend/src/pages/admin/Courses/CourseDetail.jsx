import { Accordion, Card, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileVideo, faFile } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/useToast";
import { getStorageUrl } from "@/utils/getStorageUrl";

import courseApi from "@/api/courseApi";
import sessionApi from "@/api/sessionApi";
import lessonApi from "@/api/lessonApi";
import materialApi from "@/api/materialApi";
import SessionModal from "@/components/Sessions/SessionModal";
import LessonModal from "@/components/Sessions/LessonModal";
import MaterialModal from "@/components/Sessions/MaterialModal";
import Loading from "@/components/Common/Loading";
import ConfirmDialog from "@/components/Common/ConfirmDialog";

import "../../../styles/course/admin-course-detail.css";

const CourseDetail = () => {
  const { id } = useParams();
  const { addToast } = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [showDeleteLessonConfirm, setShowDeleteLessonConfirm] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [lessonToEditMaterial, setLessonToEditMaterial] = useState(null);
  const [showDeleteMaterialConfirm, setShowDeleteMaterialConfirm] =
    useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [materialToEdit, setMaterialToEdit] = useState(null);

  useEffect(() => {
    courseApi
      .getFullDetail(id)
      .then((response) => {
        setCourse(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải thông tin môn học.");
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleSessionModalClose = () => {
    setShowSessionModal(false);
    setSessionToEdit(null);
  };
  const handleSessionModalShow = () => setShowSessionModal(true);

  const handleSessionAdded = () => {
    courseApi
      .getFullDetail(id)
      .then((response) => setCourse(response.data.data));
  };

  const handleSessionEdit = (session) => {
    setSessionToEdit(session); // Set session cần chỉnh sửa
    setShowSessionModal(true); // Mở modal để chỉnh sửa
  };
  const handleMaterialModalShow = (lesson) => {
    setLessonToEditMaterial(lesson); // Cập nhật bài học cần chỉnh sửa tài liệu
    setShowMaterialModal(true); // Mở modal tài liệu
  };

  const confirmDeleteSession = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    sessionApi
      .remove(selectedSessionId)
      .then(() => {
        addToast({
          title: "Thành công",
          message: "Buổi học đã được xóa",
          type: "success",
          duration: 1500,
        });
        handleSessionAdded();
      })
      .catch((err) => {
        console.error(err);
        addToast({
          title: "Thất bại!",
          message: "Đã có lỗi xảy ra khi xóa buổi học",
          type: "error",
          duration: 1500,
        });
      })
      .finally(() => {
        setShowConfirmDialog(false);
        setSelectedSessionId(null);
      });
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setSelectedSessionId(null);
  };
  const confirmDeleteLesson = (lesson) => {
    setLessonToDelete(lesson);
    setShowDeleteLessonConfirm(true);
  };

  const handleConfirmDeleteLesson = () => {
    lessonApi
      .deleteLesson(lessonToDelete.id)
      .then(() => {
        addToast({
          title: "Thành công!",
          message: "Bài học đã được xóa",
          type: "success",
          duration: 1500,
        });
        courseApi.getFullDetail(id).then((response) => {
          setCourse(response.data.data);
        });
      })
      .catch((err) => {
        console.error(err);
        addToast({
          title: "Thất bại!",
          message: "Đã có lỗi xảy ra khi xóa bài học",
          type: "error",
          duration: 1500,
        });
      })
      .finally(() => {
        setShowDeleteLessonConfirm(false);
        setLessonToDelete(null);
      });
  };

  const handleCancelDeleteLesson = () => {
    setShowDeleteLessonConfirm(false);
    setLessonToDelete(null);
  };

  const confirmDeleteMaterial = (material) => {
    setMaterialToDelete(material);
    setShowDeleteMaterialConfirm(true);
  };

  const handleConfirmDeleteMaterial = () => {
    materialApi
      .deleteMaterial(materialToDelete.id)
      .then(() => {
        addToast({
          title: "Thành công!",
          message: "Tài liệu đã được xóa",
          type: "success",
          duration: 1500,
        });
        courseApi.getFullDetail(id).then((res) => {
          setCourse(res.data.data);
        });
      })
      .catch((err) => {
        console.error(err);
        addToast({
          title: "Thất bại!",
          message: "Đã có lỗi khi xóa tài liệu",
          type: "error",
          duration: 1500,
        });
      })
      .finally(() => {
        setMaterialToDelete(null);
        setShowDeleteMaterialConfirm(false);
      });
  };

  const handleCancelDeleteMaterial = () => {
    setMaterialToDelete(null);
    setShowDeleteMaterialConfirm(false);
  };

  if (loading) {
    return (
      <Loading
        text="Đang tải dữ liệu..."
        size="lg"
        variant="primary"
        textVariant="primary"
      />
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) return null;

  return (
    <Container className="course-detail">
      <header className="course-detail__header mb-4">
        <Row>
          <Col md={8}>
            <h2 className="course-detail__title">{course.title}</h2>
          </Col>
          <Col
            md={4}
            className="text-right"
          >
            <Link
              to="/admin/courses"
              className="course-detail__back-link"
            >
              ← Danh sách môn học
            </Link>
          </Col>
        </Row>
      </header>
      <section className="course-detail__info mb-4">
        <h3>Thông tin môn học</h3>
        <Row>
          <Col md={6}>
            <Card className="course-detail__info-card">
              <Card.Body>
                <p>
                  <strong>Mã môn học:</strong> {course.code}
                </p>
                <p>
                  <strong>Số tín chỉ:</strong> {course.credits}
                </p>
                <p>
                  <strong>Giới thiệu:</strong> {course.description}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="course-detail__info-card">
              <Card.Body>
                <p>
                  <strong>Giờ lý thuyết:</strong> {course.theory_hours}
                </p>
                <p>
                  <strong>Giờ thực hành:</strong> {course.practice_hours}
                </p>
                <p>
                  <strong>Giờ thi:</strong> {course.exam_hours}
                </p>
                <p>
                  <strong>Tổng số giờ học:</strong> {course.total_hours}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
      <section className="course-detail__sessions">
        <div className="course-detail__schedule">
          <h3 className="course-detail__schedule-title">Lịch học</h3>
          <Button
            variant="primary"
            onClick={handleSessionModalShow}
            className="add-session-button"
          >
            + Thêm Buổi Học
          </Button>
        </div>

        {course.course_sessions.length > 0 ? (
          <Accordion>
            {course.course_sessions.map((session, sessionIndex) => (
              <Card
                key={session.id}
                className="course-detail__session-card mb-4"
              >
                <Accordion.Item eventKey={sessionIndex.toString()}>
                  <Accordion.Header>
                    Buổi {sessionIndex + 1}. {session.title}
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <p className="mb-1">
                          <strong>Thời gian:</strong>{" "}
                          {formatDate(session.start_time)} -{" "}
                          {formatDate(session.end_time)}
                        </p>
                        <p className="mb-1">
                          <strong>Địa điểm:</strong> {session.location}
                        </p>
                      </div>{" "}
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => {
                          setLessonToEdit(null);
                          setSelectedSessionId(session.id);
                          setShowLessonModal(true);
                        }}
                      >
                        + Thêm bài học
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleSessionEdit(session)} // Gọi handleSessionEdit khi nhấn sửa
                      >
                        Sửa buổi học
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => confirmDeleteSession(session.id)}
                      >
                        Xóa buổi học
                      </Button>
                    </div>
                    <p>{session.description}</p>

                    {session.lessons.length > 0 && (
                      <Accordion>
                        {session.lessons.map((lesson, lessonIndex) => (
                          <Card
                            key={lesson.id}
                            className="course-detail__lesson-card mb-2"
                          >
                            <Accordion.Item eventKey={lessonIndex.toString()}>
                              <Accordion.Header>
                                Bài {lessonIndex + 1}. {lesson.title}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() =>
                                      handleMaterialModalShow(lesson)
                                    } // Mở modal thêm tài liệu
                                  >
                                    + Thêm tài liệu
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => {
                                      setLessonToEdit(lesson);
                                      setSelectedSessionId(session.id);
                                      setShowLessonModal(true);
                                    }}
                                  >
                                    Sửa bài học
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => confirmDeleteLesson(lesson)}
                                  >
                                    Xóa bài học
                                  </Button>
                                </div>
                                <p>{lesson.content}</p>
                                {lesson.materials.length > 0 && (
                                  <div className="course-detail__lesson-materials">
                                    {lesson.materials.map((material) => (
                                      <div
                                        key={material.id}
                                        className="course-detail__material d-flex align-items-center justify-content-between"
                                      >
                                        <div>
                                          {material.type === "file" ? (
                                            <a
                                              href={getStorageUrl(
                                                material.file_path
                                              )}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="course-detail__material-link"
                                            >
                                              <FontAwesomeIcon
                                                icon={faFile}
                                                className="me-1"
                                              />{" "}
                                              {material.title}
                                            </a>
                                          ) : (
                                            <a
                                              href={material.file_path}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="course-detail__material-link"
                                            >
                                              <FontAwesomeIcon
                                                icon={faFileVideo}
                                                className="me-1"
                                              />{" "}
                                              {material.title}
                                            </a>
                                          )}
                                        </div>

                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          onClick={() => {
                                            setLessonToEditMaterial(lesson);
                                            setMaterialToEdit(material);
                                            setShowMaterialModal(true);
                                          }}
                                        >
                                          Cập nhật tài liệu
                                        </Button>

                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() =>
                                            confirmDeleteMaterial(material)
                                          }
                                        >
                                          Xóa
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          </Card>
                        ))}
                      </Accordion>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Card>
            ))}
          </Accordion>
        ) : (
          <p>Không có lịch học nào.</p>
        )}
      </section>
      <SessionModal
        show={showSessionModal}
        handleClose={handleSessionModalClose}
        courseId={id}
        onSessionAdded={handleSessionAdded}
        sessionToEdit={sessionToEdit} // Truyền thông tin session cần chỉnh sửa
        onSessionUpdated={handleSessionAdded} // Cập nhật lại sau khi sửa
      />
      {/* Modal  Bài Học */}
      <LessonModal
        show={showLessonModal}
        handleClose={() => {
          setShowLessonModal(false);
          setLessonToEdit(null);
        }}
        sessionId={selectedSessionId}
        lessonToEdit={lessonToEdit}
        onLessonUpdated={() => {
          courseApi
            .getFullDetail(id)
            .then((response) => setCourse(response.data.data));
        }}
      />
      {/* Modal tài liệu */}
      <MaterialModal
        show={showMaterialModal}
        handleClose={() => {
          setShowMaterialModal(false);
          setMaterialToEdit(null);
        }}
        lessonId={lessonToEditMaterial?.id}
        materialToEdit={materialToEdit}
        onMaterialAdded={() => {
          // Cập nhật lại khi thêm tài liệu thành công
          courseApi
            .getFullDetail(id)
            .then((response) => setCourse(response.data.data));
        }}
        onMaterialUpdated={() => {
          // Cập nhật lại khi sửa tài liệu thành công
          courseApi
            .getFullDetail(id)
            .then((response) => setCourse(response.data.data));
        }}
      />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Xác nhận xóa buổi học"
        message="Bạn có chắc chắn muốn xóa buổi học này không? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ConfirmDialog
        isOpen={showDeleteLessonConfirm}
        title="Xác nhận xóa bài học"
        message="Bạn có chắc chắn muốn xóa bài học này không? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDeleteLesson}
        onCancel={handleCancelDeleteLesson}
      />
      <ConfirmDialog
        isOpen={showDeleteMaterialConfirm}
        title="Xác nhận xóa tài liệu"
        message="Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDeleteMaterial}
        onCancel={handleCancelDeleteMaterial}
      />
    </Container>
  );
};

export default CourseDetail;
