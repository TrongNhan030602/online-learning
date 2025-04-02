// src/pages/admin/CourseDetail.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import courseApi from "../../../api/courseApi";
import lessonApi from "../../../api/lessonApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import LessonFormModal from "../../../components/Lessons/LessonFormModal";
import LessonFilesModal from "../../../components/Lessons/LessonFilesModal";
import AddDocumentModal from "../../../components/Lessons/AddDocumentModal";
import "../../../styles/course/admin-course-detail.css";
import Loading from "../../../components/Common/Loading";
import { useToast } from "../../../hooks/useToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCamera,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showLessonFilesModal, setShowLessonFilesModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  useEffect(() => {
    courseApi
      .getCourseDetail(id)
      .then((res) => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Không thể lấy chi tiết khóa học."
        );
        setLoading(false);
        addToast({
          title: "Lỗi!",
          message: "Không thể lấy chi tiết khóa học. Vui lòng thử lại sau.",
          type: "error",
          duration: 3000,
        });
      });
  }, [id, addToast]);

  if (loading)
    return (
      <div>
        <Loading
          text="Đang tải dữ liệu..."
          size="lg"
          variant="danger"
          textVariant="danger"
        />
      </div>
    );
  if (error)
    return (
      <div className="admin-course-detail__error text-danger">{error}</div>
    );
  if (!course) return null;

  // Hàm render file dưới dạng link mở tab mới
  const renderFileLink = (file) => {
    const fileUrl = getStorageUrl(file.file_path);
    return (
      <p className="admin-course-detail__file-link">
        {file.type.toUpperCase()}:{" "}
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
        >
          Xem{" "}
          {file.type === "image"
            ? "ảnh"
            : file.type === "document"
            ? "tài liệu"
            : "video"}
        </a>
      </p>
    );
  };

  // Hàm mở modal gán (chọn) tài liệu cho bài học, đồng thời lưu bài học hiện tại
  const handleManageFiles = (lesson) => {
    setCurrentLesson(lesson);
    setShowLessonFilesModal(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await courseApi.updateCourseImage(id, file);
      const updatedCourse = await courseApi.getCourseDetail(id);
      setCourse(updatedCourse.data);
      addToast({
        title: "Thành công!",
        message: "Ảnh khóa học đã được cập nhật.",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      console.log(err);
      addToast({
        title: "Lỗi!",
        message: "Không thể cập nhật ảnh khóa học.",
        type: "error",
        duration: 3000,
      });
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleAddDocument = (lesson) => {
    setCurrentLesson(lesson);
    setShowDocumentModal(true);
  };
  // Hàm cập nhật tài liệu cho bài học sau khi thêm mới
  const handleDocumentAdded = () => {
    // Reload lại chi tiết khóa học
    courseApi.getCourseDetail(id).then((res) => setCourse(res.data));
    addToast({
      title: "Thành công!",
      message: "Tài liệu đã được thêm cho bài học.",
      type: "success",
      duration: 3000,
    });
  };

  // Thêm hàm xóa tài liệu cho bài học
  const handleDeleteDocument = async (lessonId, documentId) => {
    try {
      await lessonApi.deleteDocument(lessonId, documentId);
      courseApi.getCourseDetail(id).then((res) => setCourse(res.data));
      addToast({
        title: "Thành công!",
        message: "Tài liệu đã được xóa.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Xóa tài liệu thất bại", error);
      addToast({
        title: "Lỗi!",
        message: "Không thể xóa tài liệu.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <div className="admin-course-detail">
      <header className="admin-course-detail__header">
        <div className="admin-course-detail__header-top">
          {/* Nút thêm bài học mới */}
          <button
            className="admin-course-detail__btn-add"
            onClick={() => setShowLessonModal(true)}
          >
            + Thêm bài học
          </button>
          <h2 className="admin-course-detail__title">{course.title}</h2>
          {/* Link quay lại */}
          <Link
            className="admin-course-detail__link-back"
            to={`/admin/courses`}
          >
            ← Danh sách khóa học
          </Link>
        </div>
        <div className="admin-course-detail__content">
          <div className="admin-course-detail__left">
            {/* Mô tả khóa học */}
            <p className="admin-course-detail__description">
              {course.description}
            </p>
          </div>

          <div className="admin-course-detail__middle">
            {/* Hiển thị ảnh khóa học */}
            {course.image_url && (
              <div className="admin-course-detail__image-container">
                <img
                  src={getStorageUrl(course.image_url)}
                  alt={course.title}
                  className="admin-course-detail__image"
                />
                <button
                  className="admin-course-detail__image-edit"
                  onClick={triggerFileInput}
                >
                  <FontAwesomeIcon icon={faCamera} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="admin-course-detail__image-input"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>

          <div className="admin-course-detail__right">
            {/* Giá khóa học */}
            <p className="admin-course-detail__price">
              Giá: <strong>{course.price}</strong>
            </p>
          </div>
        </div>
      </header>

      <section className="admin-course-detail__files-section">
        <h3 className="admin-course-detail__section-title">
          Tài liệu của khóa học
        </h3>
        <div className="admin-course-detail__files">
          {course.files && course.files.length > 0 ? (
            course.files.map((file) => (
              <div
                key={file.id}
                className="admin-course-detail__file-card"
              >
                {renderFileLink(file)}
              </div>
            ))
          ) : (
            <p className="admin-course-detail__no-data">Không có file nào.</p>
          )}
        </div>
      </section>

      {/* Lesstions */}
      <section className="admin-course-detail__lessons-section">
        <h3 className="admin-course-detail__section-title">
          Danh sách bài học
        </h3>
        {course.lessons && course.lessons.length > 0 ? (
          <div
            className="accordion admin-course-detail__accordion"
            id="lessonsAccordion"
          >
            {course.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="accordion-item admin-course-detail__lesson-item"
              >
                <h2
                  className="accordion-header"
                  id={`heading${lesson.id}`}
                >
                  <button
                    className="accordion-button collapsed admin-course-detail__lesson-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${lesson.id}`}
                    aria-expanded="false"
                    aria-controls={`collapse${lesson.id}`}
                  >
                    {lesson.title}{" "}
                    <span className="admin-course-detail__lesson-order">
                      (Thứ tự: {lesson.order})
                    </span>
                  </button>
                </h2>
                <div
                  id={`collapse${lesson.id}`}
                  className="accordion-collapse collapse admin-course-detail__lesson-collapse"
                  aria-labelledby={`heading${lesson.id}`}
                  data-bs-parent="#lessonsAccordion"
                >
                  <div className="accordion-body admin-course-detail__lesson-body">
                    <p className="admin-course-detail__lesson-content">
                      {lesson.content}
                    </p>
                    {lesson.video_url && (
                      <p className="admin-course-detail__lesson-video">
                        Video:{" "}
                        <a
                          href={lesson.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-course-detail__lesson-video-link"
                        >
                          Xem video
                        </a>
                      </p>
                    )}
                    <button
                      className="admin-course-detail__add-btn"
                      onClick={() => handleAddDocument(lesson)}
                      title="Thêm tài liệu"
                    >
                      <FontAwesomeIcon icon={faPlus} /> Thêm tài liệu
                    </button>
                    {lesson.documents && lesson.documents.length > 0 && (
                      <div className="admin-course-detail__lesson-documents">
                        <h5 className="admin-course-detail__lesson-documents-title">
                          Tài liệu bài học:
                        </h5>
                        <ul className="admin-course-detail__lesson-documents-list">
                          {lesson.documents.map((doc) => (
                            <li
                              key={doc.id}
                              className="admin-course-detail__lesson-documents-item"
                            >
                              Tài liệu:{" "}
                              <a
                                href={getStorageUrl(doc.file_path)}
                                target="_blank"
                                rel="noreferrer"
                                className="admin-course-detail__lesson-documents-link"
                              >
                                Xem tài liệu
                              </a>
                              <button
                                className="admin-course-detail__delete-btn"
                                onClick={() =>
                                  handleDeleteDocument(lesson.id, doc.id)
                                }
                                title="Xóa tài liệu"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {lesson.selected_files &&
                      lesson.selected_files.length > 0 && (
                        <div className="admin-course-detail__lesson-assigned-files">
                          <h5 className="admin-course-detail__selected-files-title">
                            Tài liệu từ khóa học:
                          </h5>
                          <ul className="admin-course-detail__selected-files-list">
                            {lesson.selected_files.map((sf) => (
                              <li
                                key={sf.id}
                                className="admin-course-detail__selected-files-item"
                              >
                                {sf.type.toUpperCase()}:{" "}
                                <a
                                  href={getStorageUrl(sf.file_path)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="admin-course-detail__selected-files-link"
                                >
                                  Xem
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {/* Nút mở modal gán tài liệu cho bài học */}
                    <div className="admin-course-detail__lesson-actions">
                      <button
                        className="btn admin-course-detail__btn-manage-files"
                        onClick={() => handleManageFiles(lesson)}
                      >
                        Chọn tài liệu
                      </button>

                      <Link
                        to={`/admin/courses/${course.id}/lessons/${lesson.id}`}
                        className="btn admin-course-detail__btn-detail"
                        title="Chỉnh sửa bài học"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="admin-course-detail__no-data">Không có bài học nào.</p>
        )}
      </section>

      {/* Modal thêm bài học mới */}
      {showLessonModal && (
        <LessonFormModal
          show={showLessonModal}
          courseId={parseInt(id)}
          initialData={null} // Thêm mới => không có dữ liệu
          handleClose={() => setShowLessonModal(false)}
          onSuccess={() => {
            // Sau khi thêm bài học, reload lại chi tiết khóa học
            courseApi.getCourseDetail(id).then((res) => setCourse(res.data));
            addToast({
              title: "Thành công!",
              message: "Đã thêm bài học mới.",
              type: "success",
              duration: 3000,
            });
          }}
        />
      )}

      {/* Modal gán tài liệu cho bài học */}
      {showLessonFilesModal && currentLesson && (
        <LessonFilesModal
          show={showLessonFilesModal}
          handleClose={() => setShowLessonFilesModal(false)}
          lessonId={currentLesson.id}
          courseId={course.id}
          onSuccess={() => {
            // Reload lại chi tiết khóa học để cập nhật danh sách tài liệu đã gán
            courseApi.getCourseDetail(id).then((res) => setCourse(res.data));
            addToast({
              title: "Thành công!",
              message: "Đã gán tài liệu cho bài học.",
              type: "success",
              duration: 3000,
            });
          }}
          initialSelectedFileIds={
            currentLesson.selected_files
              ? currentLesson.selected_files.map((file) => file.id)
              : []
          }
        />
      )}
      {showDocumentModal && currentLesson && (
        <AddDocumentModal
          show={showDocumentModal}
          handleClose={() => setShowDocumentModal(false)}
          lessonId={currentLesson.id}
          onDocumentAdded={handleDocumentAdded}
        />
      )}
    </div>
  );
};

export default CourseDetail;
