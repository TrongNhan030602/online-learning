import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner, Card, Badge, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import blogApi from "../../../api/blogApi";
import { getStorageUrl } from "../../../utils/getStorageUrl";
import "../../../styles/student/blogs/blogs.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // Lọc theo ngày

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogApi.getBlogs();
        console.log("Blogs:", response.data);
        setBlogs(response.data);
        setFilteredBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách blog:", err);
        setError("Không thể tải dữ liệu blog.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const filterBlogs = () => {
      let filtered = blogs;

      // Lọc theo từ khóa tìm kiếm trong tiêu đề
      if (searchTerm) {
        filtered = filtered.filter((blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Lọc theo ngày (1 tuần, 3 tuần, 1 tháng, tất cả)
      if (dateFilter) {
        const today = new Date();
        let dateLimit;

        if (dateFilter === "1week") {
          dateLimit = new Date(today.setDate(today.getDate() - 7)); // 1 tuần
        } else if (dateFilter === "3weeks") {
          dateLimit = new Date(today.setDate(today.getDate() - 21)); // 3 tuần
        } else if (dateFilter === "1month") {
          dateLimit = new Date(today.setMonth(today.getMonth() - 1)); // 1 tháng
        }

        if (dateFilter !== "all") {
          filtered = filtered.filter(
            (blog) => new Date(blog.created_at) >= dateLimit
          );
        }
      }

      setFilteredBlogs(filtered);
    };

    filterBlogs();
  }, [searchTerm, dateFilter, blogs]);

  if (loading)
    return (
      <div className="loading-container">
        <Spinner
          animation="border"
          variant="danger"
        />
        <p>Đang tải blog...</p>
      </div>
    );

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="blogs">
      <h1 className="blogs__page-title">Blog học tập</h1>

      {/* Tìm kiếm */}
      <div className="blogs__controls d-flex align-items-center gap-3 mb-4">
        <div className="blogs__search-box position-relative flex-grow-1">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm blog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="blogs__search-input"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="blogs__search-icon"
          />
        </div>

        <div className="blogs__filter-box">
          <Form.Select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="blogs__filter-select"
          >
            <option value="all">🗂️ Tất cả</option>
            <option value="1week">🕒 1 tuần gần đây</option>
            <option value="3weeks">🕒 3 tuần gần đây</option>
            <option value="1month">📅 1 tháng gần đây</option>
          </Form.Select>
        </div>
      </div>

      <div className="blogs__intro">
        <p>
          Tổng hợp các thông báo mới nhất, bài viết hướng dẫn học tập, các hệ
          thống kiến thức và bài phỏng vấn giảng viên. Giúp bạn học tốt và thú
          vị hơn.
        </p>
      </div>

      <div className="blogs__list">
        {filteredBlogs.map((blog) => {
          const isNew =
            new Date(blog.created_at) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

          return (
            <Link
              to={`/student/blogs/${blog.id}`}
              key={blog.id}
              className="blogs__link"
            >
              <Card className="blogs__card">
                {isNew && (
                  <Badge
                    pill
                    bg="danger"
                    className="blogs__ribbon"
                  >
                    Mới
                  </Badge>
                )}
                <Card.Img
                  variant="top"
                  src={
                    blog.images?.[0]?.image
                      ? getStorageUrl(blog.images[0].image)
                      : "/images/default-thumbnail.jpg"
                  }
                  alt={blog.title}
                  className="blogs__image"
                />
                <Card.Body className="blogs__info">
                  <Card.Title className="blogs__title">{blog.title}</Card.Title>
                  <Card.Text className="blogs__meta">
                    Tác giả: {blog.author?.name} | Ngày đăng:{" "}
                    {new Date(blog.created_at).toLocaleDateString("vi-VN")}
                  </Card.Text>
                  <Card.Text className="blogs__description">
                    {blog.content.slice(0, 150)}...
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Blogs;
