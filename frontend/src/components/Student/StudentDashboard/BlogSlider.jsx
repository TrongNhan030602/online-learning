import { Carousel } from "react-bootstrap";

const BlogSlider = () => {
  const blogs = [
    {
      id: 1,
      title: "Học tập hiệu quả mùa dịch",
      image: "/images/course-1.jpg",
    },
    {
      id: 2,
      title: "10 kỹ năng cần thiết cho sinh viên",
      image: "/images/course-2.jpg",
    },
  ];

  return (
    <div className="blog-slider">
      <Carousel>
        {blogs.map((blog) => (
          <Carousel.Item
            key={blog.id}
            className="blog-slider__item"
          >
            <img
              className="d-block w-100 blog-slider__image"
              src={blog.image}
              alt={blog.title}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default BlogSlider;
