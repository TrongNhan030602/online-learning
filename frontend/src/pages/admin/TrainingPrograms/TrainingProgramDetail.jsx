import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrashAlt,
  faChevronRight,
  faUsers,
  faPlus,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { useToast } from "../../../hooks/useToast";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import trainingProgramApi from "../../../api/trainingProgramApi";
import programCourseApi from "../../../api/programCourseApi";
import semesterApi from "../../../api/semesterApi";

import BannerModal from "../../../components/TrainingPrograms/Banners/BannerModal";
import CourseSelectorModal from "../../../components/TrainingPrograms/Courses/CourseSelectorModal";
import AddExamScheduleModal from "../../../components/ExamSchedule/AddExamScheduleModal";
import BulkScoreInputModal from "../../../components/Scores/BulkScoreInputModal";

import SemesterModal from "../../../components/Semester/SemesterModal";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";

import "../../../styles/trainingPrograms/training-program-detail.css";

const levelLabels = {
  college: "Cao đẳng",
  intermediate: "Trung cấp",
  certificate: "Chứng chỉ nghề",
  specialized: "Chuyên sâu",
  software: "Phần mềm",
};

const TrainingProgramDetail = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showBannerModal, setShowBannerModal] = useState(false);
  // State cho Modal xử lý học kỳ
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  // State xác nhận xóa học kỳ
  const [showConfirm, setShowConfirm] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);
  // State môn học CTĐT
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showConfirmCourse, setShowConfirmCourse] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  // State thêm lịch thi
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  // State nhập điểm
  const [showBulkScoreModal, setShowBulkScoreModal] = useState(false);
  const [selectedCourseForBulkScore, setSelectedCourseForBulkScore] =
    useState(null);

  const fetchProgram = useCallback(async () => {
    try {
      const response = await trainingProgramApi.getById(id);
      setProgram(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin chương trình đào tạo", error);
    }
  }, [id]);

  useEffect(() => {
    fetchProgram();
  }, [id, fetchProgram]);

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setShowBannerModal(true);
  };

  const handleAddBanner = () => {
    setSelectedBanner(null);
    setShowBannerModal(true);
  };

  const handleSaveBanner = () => {
    fetchProgram();
  };

  const handleSemesterClick = (semesterId) => {
    navigate(`/admin/semester-detail/${semesterId}`);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/admin/course-detail/${courseId}`);
  };

  // Xử lý xóa học kỳ
  const handleDeleteSemesterClick = (semesterId) => {
    setSemesterToDelete(semesterId);
    setShowConfirm(true);
  };

  const confirmDeleteSemester = async () => {
    if (!semesterToDelete) return;
    try {
      await semesterApi.deleteSemester(semesterToDelete);
      fetchProgram();
      addToast({
        title: "Thành công!",
        message: "Học kỳ đã được xóa.",
        type: "success",
        duration: 1500,
      });
    } catch (error) {
      console.error("Lỗi khi xóa học kỳ:", error);
    } finally {
      setShowConfirm(false);
      setSemesterToDelete(null);
    }
  };

  const cancelDeleteSemester = () => {
    setShowConfirm(false);
    setSemesterToDelete(null);
  };

  // Xử lý sửa học kỳ
  const handleEditSemester = (semester) => {
    setSelectedSemester(semester);
    setShowSemesterModal(true);
  };
  // Xử lý thêm học kỳ
  const handleAddSemester = () => {
    setSelectedSemester(null);
    setShowSemesterModal(true);
  };

  const handleAddCourse = () => {
    setShowCourseModal(true);
  };
  const handleDeleteCourseClick = (programCourseId) => {
    setCourseToDelete(programCourseId);
    setShowConfirmCourse(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      await programCourseApi.deleteProgramCourse(courseToDelete);
      fetchProgram();
      addToast({
        title: "Thành công!",
        message: "Môn học đã được xóa khỏi chương trình.",
        type: "success",
        duration: 1500,
      });
    } catch (error) {
      console.error("Lỗi khi xóa môn học:", error);
      addToast({
        title: "Lỗi!",
        message: "Không thể xóa môn học.",
        type: "error",
        duration: 2000,
      });
    } finally {
      setShowConfirmCourse(false);
      setCourseToDelete(null);
    }
  };

  const cancelDeleteCourse = () => {
    setShowConfirmCourse(false);
    setCourseToDelete(null);
  };

  if (!program) return <div className="loading">Đang tải...</div>;

  return (
    <div className="training-program-detail">
      <div className="training-program-detail__back">
        <button onClick={() => navigate(-1)}>&larr; Quay lại</button>
      </div>

      <div className="training-program-detail__header">
        <h1 className="training-program-detail__title">
          {program.name} - <strong>{program.code}</strong>
        </h1>
        <p className="training-program-detail__description">
          {program.note || "Không có mô tả"}
        </p>
      </div>

      <div className="training-program-detail__info">
        <div>
          <strong>Mã chương trình:</strong>
          <span>{program.code}</span>
        </div>
        <div>
          <strong>Cấp bậc:</strong>
          <span>{levelLabels[program.level]}</span>
        </div>
        <div>
          <strong>Cố vấn:</strong>
          <span>{program.advisor?.name || "Chưa có"}</span>
        </div>
      </div>

      {/* Banners */}
      <div className="training-program-detail__banners">
        {program.banners?.length > 0 ? (
          program.banners.map((banner) => (
            <div
              key={banner.id}
              className="training-program-detail__banner"
            >
              <img
                src={getStorageUrl(banner.image_url)}
                alt={banner.title}
                className="training-program-detail__banner-image"
              />
              <span
                className="training-program-detail__banner-icon"
                onClick={() => handleEditBanner(banner)}
              >
                <FontAwesomeIcon icon={faPen} />
              </span>
            </div>
          ))
        ) : (
          <p className="training-program-detail__no-banner">
            Chưa có banner nào.
          </p>
        )}

        <Button
          size="sm"
          variant="outline-primary"
          onClick={handleAddBanner}
          className="training-program-detail__add-banner-btn"
        >
          + Thêm banner
        </Button>
      </div>
      <div className="mt-2 mb-4">
        <Button
          variant="success"
          onClick={() => navigate(`/admin/training-programs/${id}/students`)}
        >
          <FontAwesomeIcon
            icon={faUsers}
            className="mx-1"
          />
          Quản lý học viên
        </Button>
      </div>
      {/* Program Semesters */}
      {program.semesters?.length > 0 && (
        <div className="training-program-detail__semesters">
          <h3>
            Học kỳ{" "}
            <button
              className="training-program-detail__button"
              onClick={handleAddSemester}
            >
              {" "}
              <FontAwesomeIcon
                icon={faPlus}
                className="mx-1"
              />
              Thêm học kỳ
            </button>
          </h3>
          <ul className="training-program-detail__semester-list">
            {program.semesters.map((semester) => (
              <li
                key={semester.id}
                onClick={() => handleSemesterClick(semester.id)}
                className="training-program-detail__semester-item"
              >
                <span className="training-program-detail__semester-name">
                  {semester.name}{" "}
                  <span className="training-program-detail__semester-icon">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </span>
                </span>
                <div className="training-program-detail__semester-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSemester(semester);
                    }}
                    className="training-program-detail__semester-btn training-program-detail__semester-btn--edit"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSemesterClick(semester.id);
                    }}
                    className="training-program-detail__semester-btn training-program-detail__semester-btn--delete"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Program Courses */}
      {(program.program_courses?.length > 0 || !program.semesters?.length) && (
        <div className="training-program-detail__courses">
          <h3 className="mb-2">
            Danh sách môn học{" "}
            <button
              className="training-program-exam__button"
              onClick={() => navigate("/admin/exam-schedules")}
            >
              <FontAwesomeIcon
                icon={faClipboardList}
                className="me-1"
              />
              Quản lý lịch thi
            </button>
            <button
              className="training-program-detail__button"
              onClick={handleAddCourse}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="mx-1"
              />
              Chọn môn học
            </button>
          </h3>
          {program.program_courses?.length === 0 &&
          !program.semesters?.length ? (
            <p className="text-center">
              Chưa có môn học nào được gán cho chương trình này.
            </p>
          ) : (
            <ul className="training-program-detail__course-list">
              {program.program_courses.map((course) => {
                const courseDetails = course.course;
                return (
                  <li
                    key={course.id}
                    className="course-item d-flex justify-content-between align-items-start"
                  >
                    <div
                      onClick={() => handleCourseClick(course.course.id)}
                      style={{ cursor: "pointer", flex: 1 }}
                    >
                      <strong>{courseDetails.title}</strong> (
                      {courseDetails.code})<p>{courseDetails.description}</p>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      title="Thêm lịch thi"
                      onClick={() => {
                        setSelectedCourseId(course.course.id);
                        setShowAddExamModal(true);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="me-1"
                      />
                      Thêm lịch thi
                    </button>
                    <button
                      onClick={() => handleDeleteCourseClick(course.id)}
                      className="btn btn-sm btn-outline-danger ms-2"
                      title="Xóa môn học"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success ms-2"
                      title="Nhập điểm học tập"
                      onClick={() => {
                        setSelectedCourseForBulkScore(course.course);
                        setShowBulkScoreModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faClipboardList} />
                      &nbsp;Nhập điểm hàng loạt
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Banner Modal */}
      <BannerModal
        show={showBannerModal}
        onHide={() => setShowBannerModal(false)}
        programId={id}
        selectedBanner={selectedBanner}
        onSave={handleSaveBanner}
      />
      {/* Modal xử lý học kỳ */}
      <SemesterModal
        show={showSemesterModal}
        onHide={() => setShowSemesterModal(false)}
        programId={id}
        selectedSemester={selectedSemester}
        onSave={fetchProgram}
      />
      {/* Modal xử lý chọn môn */}
      <CourseSelectorModal
        show={showCourseModal}
        onHide={() => setShowCourseModal(false)}
        trainingProgramId={id}
        onSave={fetchProgram}
      />
      {/* Modal thêm lịch thi */}
      <AddExamScheduleModal
        show={showAddExamModal}
        onClose={() => {
          setShowAddExamModal(false);
          setSelectedCourseId(null);
        }}
        courseId={selectedCourseId}
        trainingProgramId={id}
        semesterId={program?.semesters?.[0]?.id ?? null}
        onSuccess={() => {
          addToast({
            title: "Thành công!",
            message: "Đã thêm lịch thi mới.",
            type: "success",
            duration: 1500,
          });
        }}
      />
      {/* Modal nhập điểm */}
      <BulkScoreInputModal
        show={showBulkScoreModal}
        onClose={() => {
          setShowBulkScoreModal(false);
          setSelectedCourseForBulkScore(null);
        }}
        trainingProgramId={id}
        semesterId={null} // như yêu cầu semesterId = null
        course={selectedCourseForBulkScore}
        onSuccess={() => {
          addToast({
            title: "Thành công!",
            message: "Nhập điểm hàng loạt thành công",
            type: "success",
            duration: 1500,
          });
        }}
      />

      <ConfirmDialog
        isOpen={showConfirm}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa học kỳ này?"
        onConfirm={confirmDeleteSemester}
        onCancel={cancelDeleteSemester}
      />
      <ConfirmDialog
        isOpen={showConfirmCourse}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa môn học này khỏi chương trình?"
        onConfirm={confirmDeleteCourse}
        onCancel={cancelDeleteCourse}
      />
    </div>
  );
};

export default TrainingProgramDetail;
