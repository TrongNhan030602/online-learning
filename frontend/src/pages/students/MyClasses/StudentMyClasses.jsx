import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import studentClassApi from "../../../api/studentClassApi";
import Loading from "../../../components/Common/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/student/my-class/my-class.css";

const StudentMyClasses = () => {
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hàm format ngày theo dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const response = await studentClassApi.getMyClasses();
        if (response.status) {
          setMyClasses(response.data.data);
        } else {
          console.error("Không tìm thấy lớp học.");
        }
      } catch (error) {
        console.error(error);
        console.error("Lỗi khi tải danh sách lớp học.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyClasses();
  }, []);

  const handleClassClick = (classroomId) => {
    navigate(`/student/my-classes/${classroomId}`);
  };

  if (loading)
    return (
      <Loading
        text="Đang tải lớp học..."
        size="lg"
        variant="danger"
        textVariant="danger"
      />
    );

  return (
    <div className="student-my-classes">
      <h2 className="student-my-classes__title">Danh sách lớp học của bạn</h2>
      <div className="student-my-classes__list">
        {myClasses.length > 0 ? (
          myClasses.map((classroom) => (
            <div
              key={classroom.id}
              className="student-my-classes__item"
              onClick={() => handleClassClick(classroom.id)}
            >
              <div className="student-my-classes__item-header">
                <FontAwesomeIcon
                  icon={faBook}
                  className="student-my-classes__item-icon"
                />
                <h3 className="student-my-classes__item-title">
                  {classroom.name}
                </h3>
              </div>
              <p className="student-my-classes__item-course-title">
                {classroom.course.title}
              </p>
              <div className="student-my-classes__item-date">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="student-my-classes__item-icon"
                />
                <span>{`Thời gian học: ${formatDate(
                  classroom.start_date
                )} - ${formatDate(classroom.end_date)}`}</span>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có lớp học nào.</p>
        )}
      </div>
    </div>
  );
};

export default StudentMyClasses;
