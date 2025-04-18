import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import trainingProgramApi from "../../../api/trainingProgramApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import "../../../styles/trainingPrograms/training-program-detail.css";

const TrainingProgramDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trainingProgram, setTrainingProgram] = useState(null);

  useEffect(() => {
    trainingProgramApi
      .getById(id)
      .then((response) => setTrainingProgram(response.data))
      .catch((error) =>
        console.error("Lỗi khi lấy thông tin chương trình đào tạo", error)
      );
  }, [id]);

  if (!trainingProgram) {
    return <div className="loading">Đang tải...</div>;
  }

  const course = trainingProgram.course;
  const courseImageUrl = course?.image_url
    ? getStorageUrl(course.image_url)
    : null;

  return (
    <div className="training-program-detail">
      <div className="training-program-detail__back">
        <button onClick={() => navigate(-1)}>← Quay lại</button>
      </div>

      <div className="training-program-detail__header">
        <h1 className="training-program-detail__title">
          {trainingProgram.name}
        </h1>
        <p className="training-program-detail__description">
          {trainingProgram.description || "Không có mô tả"}
        </p>
      </div>

      <div className="training-program-detail__info">
        <div className="training-program-detail__duration">
          <h3>Thời gian:</h3>
          <p>{trainingProgram.duration || "Không xác định"} tháng</p>
        </div>
        <div className="training-program-detail__requirements">
          <h3>Yêu cầu:</h3>
          <p>{trainingProgram.requirements || "Không có yêu cầu cụ thể"}</p>
        </div>
        <div className="training-program-detail__objectives">
          <h3>Mục tiêu:</h3>
          <p>{trainingProgram.objectives || "Chưa cập nhật mục tiêu"}</p>
        </div>
      </div>

      {course ? (
        <div className="training-program-detail__course-info">
          <h2>Thuộc về khóa học</h2>
          <div className="training-program-detail__course">
            {courseImageUrl && (
              <img
                className="training-program-detail__course-image"
                src={courseImageUrl}
                alt={course.title}
              />
            )}
            <div className="training-program-detail__course-description">
              <h3>{course.title}</h3>
              <p>{course.description || "Không có mô tả khóa học"}</p>
              <p className="training-program-detail__course-price">
                Giá: {new Intl.NumberFormat().format(course.price || 0)} VND
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="training-program-detail__no-course">
          Chưa có thông tin khóa học.
        </p>
      )}

      <div className="training-program-detail__classrooms">
        <h3>Lớp học</h3>
        {course?.class_rooms?.length > 0 ? (
          course.class_rooms.map((classRoom) => (
            <div
              key={classRoom.id}
              className="training-program-detail__classroom"
            >
              <h4>{classRoom.name}</h4>
              <p>
                Thời gian: {new Date(classRoom.start_date).toLocaleDateString()}{" "}
                - {new Date(classRoom.end_date).toLocaleDateString()}
              </p>
              <p>
                Trạng thái:{" "}
                {{
                  open: "Mở",
                  ongoing: "Đang diễn ra",
                  completed: "Đã hoàn thành",
                  closed: "Đóng",
                }[classRoom.status] || "Chưa xác định"}
              </p>
              <p>
                Số lượng học viên: {classRoom.current_students}/
                {classRoom.max_students}
              </p>
            </div>
          ))
        ) : (
          <p>Chưa có lớp học nào được mở cho chương trình này.</p>
        )}
      </div>
    </div>
  );
};

export default TrainingProgramDetail;
