import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import BannerModal from "../../../components/TrainingPrograms/Banners/BannerModal"; // Import BannerModal vào đây

import trainingProgramApi from "../../../api/trainingProgramApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
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
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showBannerModal, setShowBannerModal] = useState(false);

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
    setSelectedBanner(null); // Đặt selectedBanner là null để thêm mới banner
    setShowBannerModal(true);
  };

  const handleSaveBanner = () => {
    fetchProgram(); // Tải lại banners sau khi lưu
  };

  const handleSemesterClick = (semesterId) => {
    navigate(`/admin/semester-detail/${semesterId}`);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/admin/course-detail/${courseId}`);
  };

  const handleAddSemester = () => {
    console.log("Thêm học kỳ mới");
  };

  const handleAddCourse = () => {
    console.log("Chọn môn học cho chương trình");
  };

  if (!program) return <div className="loading">Đang tải...</div>;

  return (
    <div className="training-program-detail">
      <div className="training-program-detail__back">
        <button onClick={() => navigate(-1)}>&larr; Quay lại</button>
      </div>

      <div className="training-program-detail__header">
        <h1 className="training-program-detail__title">{program.name}</h1>
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
      {program.banners?.length > 0 && (
        <div className="training-program-detail__banners">
          {program.banners.map((banner) => (
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
          ))}
          <Button
            size="sm"
            variant="outline-primary"
            onClick={handleAddBanner}
          >
            + Thêm banner
          </Button>
        </div>
      )}

      {/* Program Semesters */}
      {program.semesters?.length > 0 && (
        <div className="training-program-detail__semesters">
          <h3>
            Học kỳ{" "}
            <button
              className="training-program-detail__button"
              onClick={handleAddSemester}
            >
              Thêm học kỳ
            </button>
          </h3>
          <ul>
            {program.semesters.map((semester) => (
              <li
                key={semester.id}
                className="semester-item"
                onClick={() => handleSemesterClick(semester.id)}
              >
                Học kỳ {semester.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Program Courses */}
      {program.program_courses?.length > 0 && !program.semesters?.length && (
        <div className="training-program-detail__courses">
          <h3>
            Danh sách môn học{" "}
            <button
              className="training-program-detail__button"
              onClick={handleAddCourse}
            >
              Chọn môn học
            </button>
          </h3>
          <ul>
            {program.program_courses.map((course) => {
              const courseDetails = course.course;
              return (
                <li
                  key={course.id}
                  onClick={() => handleCourseClick(course.course.id)}
                  className="course-item"
                >
                  <strong>{courseDetails.title}</strong> ({courseDetails.code})
                  <p>{courseDetails.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {!program.program_courses?.length && !program.semesters?.length && (
        <p>
          Chưa có môn học nào hoặc học kỳ nào được gán cho chương trình này.
        </p>
      )}

      {/* Banner Modal */}
      <BannerModal
        show={showBannerModal}
        onHide={() => setShowBannerModal(false)}
        programId={id}
        selectedBanner={selectedBanner}
        onSave={handleSaveBanner}
      />
    </div>
  );
};

export default TrainingProgramDetail;
