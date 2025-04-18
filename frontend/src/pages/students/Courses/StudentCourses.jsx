import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import courseApi from "../../../api/courseApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import "../../../styles/student/courses/student-courses.css";
import Loading from "../../../components/Common/Loading";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses();
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách khóa học:", err);
        setError("Lỗi khi lấy dữ liệu khóa học.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading)
    return (
      <Loading
        text="Đang tải khóa học..."
        size="lg"
        variant="danger"
        textVariant="danger"
      />
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="student-courses">
      <h1>Danh sách khóa học</h1>
      <div className="courses-list">
        {courses.map((course) => {
          const isNew =
            new Date(course.created_at) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

          return (
            <div
              key={course.id}
              className="course-card"
            >
              {isNew && <div className="course-card__ribbon">Mới</div>}
              <img
                src={getStorageUrl(course.image_url)}
                alt={course.title}
                className="course-card__image"
              />
              <div className="course-card__info">
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <p className="course-card__price">
                  <FontAwesomeIcon icon={faDollarSign} />
                  {new Intl.NumberFormat().format(course.price)} VND
                </p>
                <Link
                  to={`/student/courses/${course.id}`}
                  className="course-card__link"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  Xem chi tiết
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentCourses;
