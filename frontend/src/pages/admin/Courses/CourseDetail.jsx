// src/pages/admin/CourseDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import courseApi from "../../../api/courseApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import LessonFormModal from "../../../components/Lessons/LessonFormModal";
import LessonFilesModal from "../../../components/Lessons/LessonFilesModal";
import "../../../styles/course/admin-course-detail.css";
import Loading from "../../../components/Common/Loading";
import { useToast } from "../../../hooks/useToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showLessonFilesModal, setShowLessonFilesModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const { addToast } = useToast();

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
        <p className="admin-course-detail__description">{course.description}</p>
        <p className="admin-course-detail__price">
          Giá: <strong>{course.price}</strong>
        </p>
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
                    {lesson.document && (
                      <p className="admin-course-detail__lesson-document">
                        Tài liệu:{" "}
                        <a
                          href={getStorageUrl(lesson.document)}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-course-detail__lesson-document-link"
                        >
                          Xem tài liệu
                        </a>
                      </p>
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
                      {/* Nút sửa bài học */}
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
    </div>
  );
};

export default CourseDetail;
