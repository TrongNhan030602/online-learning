// src/pages/student/blogs/BlogDetailPage.jsx

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import blogApi from "../../../api/blogApi";
import { Container, Image } from "react-bootstrap";
import { getStorageUrl } from "../../../utils/getStorageUrl"; // ✅ Thêm dòng này
import "../../../styles/student/blogs/blog-detail.css";
const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogApi.getBlogDetail(id);
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <p>Đang tải bài viết...</p>;

  return (
    <Container className="blog-detail my-4">
      {/* Breadcrumb */}
      <div className="blog-detail__breadcrumb mb-3">
        <Link
          to="/student/blogs"
          className="breadcrumb-link"
        >
          Blog
        </Link>{" "}
        &gt;&nbsp;
        <span className="breadcrumb-current">{blog.title}</span>
      </div>

      <h2 className="blog-detail__title">{blog.title}</h2>
      <div className="blog-detail__meta">
        <span>Tác giả: {blog.author?.name}</span> •{" "}
        <span>{new Date(blog.created_at).toLocaleDateString("vi-VN")}</span>
      </div>

      {blog.images?.length > 0 && (
        <div className="blog-detail__images mb-3">
          {blog.images.map((img) => (
            <Image
              key={img.id}
              src={getStorageUrl(img.image)} // dùng hàm tiện ích
              fluid
              className="blog-detail__image"
            />
          ))}
        </div>
      )}

      <div className="blog-detail__content">
        {blog.content.split("\n").map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
    </Container>
  );
};

export default BlogDetailPage;
