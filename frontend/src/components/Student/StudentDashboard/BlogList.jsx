import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

const BlogList = () => {
  const blogs = [
    {
      id: 1,
      title: "Cách học lập trình nhanh chóng",
      description: "Mẹo học lập trình hiệu quả.",
    },
    {
      id: 2,
      title: "Các công cụ học trực tuyến",
      description: "Giới thiệu các công cụ học trực tuyến miễn phí.",
    },
    {
      id: 3,
      title: "Lập kế hoạch học tập",
      description: "Cách lập kế hoạch học tập hiệu quả cho sinh viên.",
    },
  ];

  return (
    <div className="blog-list">
      <h3 className="blog-list__title">
        <FontAwesomeIcon
          icon={faNewspaper}
          className="blog-list__icon"
        />
        Bài viết mới
      </h3>
      <ul className="blog-list__items">
        {blogs.map((blog) => (
          <li
            key={blog.id}
            className="blog-list__item"
          >
            <h4 className="blog-list__item-title">{blog.title}</h4>
            <p className="blog-list__item-description">{blog.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
