import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Card, Badge, Spinner } from "react-bootstrap";
import courseApi from "../../../api/courseApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import "../../../styles/student/courses/student-courses.css";

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
      <div className="loading-container">
        <Spinner
          animation="border"
          variant="primary"
        />
        <p>Đang tải khóa học...</p>
      </div>
    );

  if (error) return <div>{error}</div>;

  return (
    <div className="student-courses">
      <h1 className="student-courses__page-title">Danh sách khóa học</h1>
      <div className="student-courses__list">
        {courses.map((course) => {
          const isNew =
            new Date(course.created_at) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

          return (
            <Card
              key={course.id}
              className="student-courses__card"
            >
              {isNew && (
                <Badge
                  pill
                  bg="success"
                  className="student-courses__ribbon"
                >
                  Mới
                </Badge>
              )}
              <Card.Img
                variant="top"
                src={getStorageUrl(course.image_url)}
                alt={course.title}
                className="student-courses__image"
              />
              <Card.Body className="student-courses__info">
                <Card.Title className="student-courses__title">
                  {course.title}
                </Card.Title>
                <Card.Text className="student-courses__description">
                  {course.description}
                </Card.Text>
                <p className="student-courses__price">
                  <FontAwesomeIcon icon={faDollarSign} />
                  {new Intl.NumberFormat().format(course.price)} VND
                </p>
                <Link
                  to={`/student/courses/${course.id}`}
                  className="student-courses__link"
                >
                  <FontAwesomeIcon icon={faArrowRight} /> Xem chi tiết
                </Link>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudentCourses;
