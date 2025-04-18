// src/pages/students/MyClasses/StudentMyClasses.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import studentClassApi from "../../../api/studentClassApi";
import Loading from "../../../components/Common/Loading";

import "../../../styles/student/my-class/my-class.css";
const StudentMyClasses = () => {
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Chuyển hướng khi nhấp vào lớp học
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
    <div>
      <h2>Danh sách lớp học của bạn</h2>
      <div className="class-list">
        {myClasses.length > 0 ? (
          myClasses.map((classroom) => (
            <div
              key={classroom.id}
              className="class-item"
              onClick={() => handleClassClick(classroom.id)}
            >
              <h3>{classroom.name}</h3>
              <p>{classroom.course.title}</p>
              <p>{`Thời gian học: ${classroom.start_date} - ${classroom.end_date}`}</p>
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
