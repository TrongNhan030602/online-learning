import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

import blogApi from "../../../api/blogApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../styles/student/blogs/blog-slider.css";

const BlogSlider = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const startXRef = useRef(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogApi.getBlogs();
        const blogsWithImages = response.data
          .filter((blog) => blog.images && blog.images.length > 0)
          .slice(0, 6);
        setBlogs(blogsWithImages);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách blog:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleMouseDown = (e) => {
    startXRef.current = e.clientX;
  };

  const handleMouseUp = (e, blogId) => {
    const deltaX = Math.abs(e.clientX - startXRef.current);
    if (deltaX < 10) {
      navigate(`/student/blogs/${blogId}`);
    }
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="dashboard__section blog-slider-section">
      {/* <h2 className="dashboard__section-title">
        <FontAwesomeIcon icon={faNewspaper} /> Blog nổi bật
      </h2> */}

      <Slider
        {...settings}
        className="dashboard__slider"
      >
        {blogs.map((blog) => (
          <div
            className="dashboard__slide"
            key={blog.id}
            onMouseDown={handleMouseDown}
            onMouseUp={(e) => handleMouseUp(e, blog.id)}
          >
            <Card className="blog-card">
              {blog.images.length > 0 && (
                <Card.Img
                  variant="top"
                  src={getStorageUrl(blog.images[0].image)}
                  alt={`Ảnh blog: ${blog.title}`}
                  className="blog-card__image"
                />
              )}
              <Card.Body className="blog-card__body">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{blog.title}</Tooltip>}
                >
                  <Card.Title className="blog-card__title">
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

export default BlogSlider;
