import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpenReader,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";

import blogApi from "../../../api/blogApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../styles/student/blogs/blog-list.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const isDragging = useRef(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogApi.getBlogs();
        const withImage = response.data.filter(
          (blog) => blog.images?.length > 0
        );
        setBlogs(withImage.slice(-10)); // Lấy 10 blog gần nhất
      } catch (error) {
        console.error("Lỗi khi tải blog:", error);
      }
    };
    fetchBlogs();
  }, []);

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Mặc định là 5 trên PC
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200, // >=992 < 1200
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992, // >=768 < 992
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // >=576 < 768
        settings: {
          slidesToShow: 2, // mobile hiển thị 2 blog
        },
      },
      {
        breakpoint: 576, // <576
        settings: {
          slidesToShow: 1, // vẫn giữ 2 blog
        },
      },
    ],
  };

  return (
    <section className="student-dashboard__blog-list-section">
      <div className="blog-list__header">
        <h2 className="dashboard__section-title">
          <FontAwesomeIcon
            icon={faBookOpenReader}
            className="dashboard__section-title-icon"
          />
          Blog học tập
        </h2>
        <Button
          variant="link"
          className="blog-list__see-all"
          onClick={() => navigate("/student/blogs")}
        >
          Xem tất cả{" "}
          <FontAwesomeIcon
            icon={faAngleRight}
            className="blog-list__see-all-icon"
          />
        </Button>
      </div>

      <Slider
        {...settings}
        className="blog-list__slider"
      >
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="blog-list__slide"
          >
            <Card
              className="blog-list__card"
              onMouseDown={() => (isDragging.current = false)}
              onMouseMove={() => (isDragging.current = true)}
              onMouseUp={() => {
                if (!isDragging.current) {
                  navigate(`/student/blogs/${blog.id}`);
                }
              }}
              onTouchStart={() => (isDragging.current = false)}
              onTouchMove={() => (isDragging.current = true)}
              onTouchEnd={() => {
                if (!isDragging.current) {
                  navigate(`/student/blogs/${blog.id}`);
                }
              }}
            >
              <Card.Img
                variant="top"
                src={getStorageUrl(blog.images[0].image)}
                alt={blog.title}
                className="blog-list__image"
              />
              <Card.Body>
                <OverlayTrigger overlay={<Tooltip>{blog.title}</Tooltip>}>
                  <Card.Title className="blog-list__card-title">
                    {blog.title}
                  </Card.Title>
                </OverlayTrigger>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default BlogList;
