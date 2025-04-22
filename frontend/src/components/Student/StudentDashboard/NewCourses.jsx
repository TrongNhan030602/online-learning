import { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import courseApi from "../../../api/courseApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import "../../../styles/student/courses/new-courses.css";

const NewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses();
        const allCourses = response.data;
        const latestCourses = allCourses.slice(-10);
        setCourses(latestCourses);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="dashboard__section new-courses">
      <h3 className="dashboard__section-title">
        <FontAwesomeIcon
          icon={faNewspaper}
          className="dashboard__section-title-icon"
        />
        Khóa học mới ra mắt
      </h3>

      {loading ? (
        <div className="spinner-container">
          <Spinner
            animation="border"
            variant="primary"
          />
        </div>
      ) : courses.length === 0 ? (
        <div className="no-courses-message">
          Không có khóa học nào mới ra mắt.
        </div>
      ) : (
        <Row className="new-courses__row">
          {courses.map((course) => (
            <Col
              lg={3}
              md={4}
              sm={6}
              key={course.id}
              className="mb-4"
            >
              <Link
                to={`/student/courses/${course.id}`}
                className="course-card__link"
              >
                <Card className="course-card h-100">
                  <Card.Img
                    variant="top"
                    src={getStorageUrl(course.image_url)}
                    alt={course.title}
                    className="course-card__image"
                  />
                  <Card.Body>
                    <Card.Title className="course-card__title">
                      {course.title}
                    </Card.Title>
                    <Card.Text className="course-card__text">
                      {course.description.length > 100
                        ? course.description.slice(0, 100) + "..."
                        : course.description}
                    </Card.Text>
                    <Card.Text className="course-card__price">
                      Giá: {parseInt(course.price).toLocaleString()} VND
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
};

export default NewCourses;
