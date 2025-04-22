import { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import studentClassApi from "../../../api/studentClassApi";
import "../../../styles/student/my-class/registered-classes.css";

const RegisteredClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await studentClassApi.getMyClasses();
        setClasses(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section className="dashboard__section registered-classes">
      <h3 className="dashboard__section-title">
        <FontAwesomeIcon icon={faChalkboardTeacher} /> Lớp đã tham gia
      </h3>

      {loading ? (
        <div className="text-center py-4">
          <Spinner
            animation="border"
            variant="primary"
          />
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-4 text-muted">
          Bạn chưa tham gia lớp học nào.
        </div>
      ) : (
        <Row>
          {classes.map((item) => (
            <Col
              md={4}
              key={item.id}
              className="mb-4"
            >
              <Link
                to={`/student/my-classes/${item.id}`}
                className="class-card__link"
              >
                <Card className="dashboard__card class-card h-100">
                  <Card.Img
                    variant="top"
                    src={item.course.image_url}
                    alt={item.course.title}
                    className="class-card__image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/fallback-image.jpg"; // ảnh dự phòng nếu lỗi
                    }}
                  />
                  <Card.Body>
                    <Card.Title
                      className="class-card__title"
                      title={item.course.title}
                    >
                      {item.course.title}
                    </Card.Title>
                    <Card.Text className="class-card__text">
                      {item.name}
                    </Card.Text>
                    <Card.Text className="class-card__text">
                      Thời gian: {formatDate(item.start_date)} -{" "}
                      {formatDate(item.end_date)}
                    </Card.Text>
                    <Card.Text className="class-card__text">
                      Học viên: {item.current_students}/{item.max_students}
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

export default RegisteredClasses;
