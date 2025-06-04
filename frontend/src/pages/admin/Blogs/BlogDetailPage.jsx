/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import blogApi from "@/api/blogApi";
import { getStorageUrl } from "@/utils/getStorageUrl";
import {
  Container,
  Row,
  Col,
  Image,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faEdit,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import "../../../styles/blog/blog-detail-page.css";

// Hàm parse content thành các section theo số thứ tự đầu dòng
function parseContentIntoSections(rawContent) {
  const lines = rawContent.split("\n").map((l) => l.trim());
  const sections = [];

  let currentSection = { title: null, content: [] };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\d+\.\s+/.test(line)) {
      if (currentSection.title !== null || currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/^\d+\.\s+/, ""),
        content: [],
      };
    } else {
      currentSection.content.push(line);
    }
  }
  if (currentSection.title !== null || currentSection.content.length > 0) {
    sections.push(currentSection);
  }
  return sections;
}

function RenderContentLines({ lines }) {
  let result = [];
  let listBuffer = [];

  function flushList() {
    if (listBuffer.length > 0) {
      result.push(
        <ul
          key={`ul-${result.length}`}
          className="blog-detail__list"
        >
          {listBuffer.map((item, idx) => (
            <li key={idx}>{item.replace(/^- /, "")}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  }

  lines.forEach((line, idx) => {
    if (line.startsWith("- ")) {
      listBuffer.push(line);
    } else {
      flushList();
      if (line) {
        result.push(
          <p
            key={`p-${idx}`}
            className="blog-detail__paragraph"
          >
            {line}
          </p>
        );
      }
    }
  });
  flushList();
  return <>{result}</>;
}

// Hàm tạo id cho section để làm anchor link
const getSectionId = (title, index) =>
  `section-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingImageId, setEditingImageId] = useState(null);
  const [tempCaption, setTempCaption] = useState("");
  const [tempOrder, setTempOrder] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogApi.getBlogDetail(id);
        setBlog(res?.data);
      } catch (error) {
        console.error("Lỗi khi tải blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="blog-detail__loading text-center mt-5">
        <Spinner
          animation="border"
          role="status"
        />
        <div>Đang tải...</div>
      </div>
    );
  if (!blog)
    return (
      <div className="blog-detail__not-found text-center mt-5">
        Không tìm thấy blog.
      </div>
    );

  const sortedImages = [...(blog.images || [])].sort(
    (a, b) => a.order - b.order
  );
  const firstImage = sortedImages.length > 0 ? sortedImages[0] : null;
  const otherImages = sortedImages.slice(1);

  const startEdit = (img) => {
    setEditingImageId(img.id);
    setTempCaption(img.caption || "");
    setTempOrder(img.order || 0);
  };

  const cancelEdit = () => {
    setEditingImageId(null);
    setTempCaption("");
    setTempOrder(0);
  };

  const saveEdit = async () => {
    try {
      await blogApi.updateImage(editingImageId, {
        caption: tempCaption,
        order: Number(tempOrder),
      });
      const updatedImages = blog.images.map((img) =>
        img.id === editingImageId
          ? { ...img, caption: tempCaption, order: Number(tempOrder) }
          : img
      );
      setBlog({ ...blog, images: updatedImages });
      cancelEdit();
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh:", error);
      alert("Cập nhật ảnh thất bại, vui lòng thử lại.");
    }
  };

  const sections = parseContentIntoSections(blog.content);
  const introSection = sections[0].title === null ? sections[0] : null;
  const otherSections = introSection ? sections.slice(1) : sections;

  const imagesBySection = otherSections
    .map((_, idx) => otherImages[idx])
    .filter(Boolean);
  const leftoverImages = otherImages.slice(otherSections.length);

  return (
    <Container className="blog-detail py-4">
      {/* Breadcrumb */}
      <nav
        aria-label="breadcrumb"
        className="blog-detail__breadcrumb mb-4"
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item text-uppercase">
            <Link
              to="/admin/blogs"
              className="blog-detail__breadcrumb-link"
            >
              Blog
            </Link>
          </li>
          <li
            className="breadcrumb-item active text-uppercase"
            aria-current="page"
          >
            {blog.type}
          </li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="blog-detail__title mb-3">{blog.title}</h1>

      {/* Summary */}
      <p className="blog-detail__summary mb-4">{blog.summary}</p>

      {/* Meta info */}
      <div className="blog-detail__meta mb-4">
        <FontAwesomeIcon
          icon={faCalendarAlt}
          className="me-2"
        />
        <span>{new Date(blog.published_at).toLocaleDateString("vi-VN")}</span>
      </div>

      {/* First main image */}
      {firstImage && (
        <div className="blog-detail__first-image mb-5">
          <Image
            src={getStorageUrl(firstImage.image)}
            alt={firstImage.caption || "blog image"}
            fluid
            rounded
            className="blog-detail__image"
          />
          {editingImageId === firstImage.id ? (
            <Form className="blog-detail__form mt-3">
              <Form.Group
                controlId={`caption-${firstImage.id}`}
                className="mb-2"
              >
                <Form.Label>Caption</Form.Label>
                <Form.Control
                  type="text"
                  value={tempCaption}
                  onChange={(e) => setTempCaption(e.target.value)}
                  placeholder="Nhập caption ảnh"
                />
              </Form.Group>
              <Form.Group
                controlId={`order-${firstImage.id}`}
                className="mb-3"
              >
                <Form.Label>Thứ tự hiển thị</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={tempOrder}
                  onChange={(e) => setTempOrder(e.target.value)}
                />
              </Form.Group>
              <div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={saveEdit}
                  className="me-2"
                >
                  <FontAwesomeIcon icon={faSave} /> Lưu
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={cancelEdit}
                >
                  <FontAwesomeIcon icon={faTimes} /> Hủy
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <div className="blog-detail__caption mt-2">
                {firstImage.caption || <i>Chưa có chú thích</i>}
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => startEdit(firstImage)}
                className="mt-2"
              >
                <FontAwesomeIcon icon={faEdit} /> Sửa ảnh
              </Button>
            </>
          )}
        </div>
      )}

      {/* Mục lục (Table of Contents) */}
      {otherSections.length > 0 && (
        <div className="blog-detail__toc mb-5 p-3 border rounded bg-light">
          <h2 className="blog-detail__toc-title mb-3">Nội dung chính</h2>
          <ol className="blog-detail__toc-list ps-3">
            {otherSections.map((section, idx) => (
              <li key={idx}>
                <a
                  href={`#${getSectionId(section.title, idx)}`}
                  className="blog-detail__toc-link"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Content Sections */}
      <div className="blog-detail__content">
        {introSection && <RenderContentLines lines={introSection.content} />}

        {otherSections.map((section, idx) => (
          <section
            key={idx}
            id={getSectionId(section.title, idx)}
            className="blog-detail__section mb-5"
          >
            <h2 className="blog-detail__section-title mb-3">
              {`${idx + 1}. ${section.title}`}
            </h2>

            <div className="blog-detail__section-body">
              <RenderContentLines lines={section.content} />
              {imagesBySection[idx] && (
                <div className="blog-detail__section-image mt-4">
                  <Image
                    src={getStorageUrl(imagesBySection[idx].image)}
                    alt={imagesBySection[idx].caption || "section image"}
                    fluid
                    rounded
                    className="blog-detail__image"
                  />
                  {editingImageId === imagesBySection[idx].id ? (
                    <Form className="blog-detail__form mt-3">
                      <Form.Group
                        controlId={`caption-${imagesBySection[idx].id}`}
                        className="mb-2"
                      >
                        <Form.Label>Caption</Form.Label>
                        <Form.Control
                          type="text"
                          value={tempCaption}
                          onChange={(e) => setTempCaption(e.target.value)}
                          placeholder="Nhập caption ảnh"
                        />
                      </Form.Group>
                      <Form.Group
                        controlId={`order-${imagesBySection[idx].id}`}
                        className="mb-3"
                      >
                        <Form.Label>Thứ tự hiển thị</Form.Label>
                        <Form.Control
                          type="number"
                          min={0}
                          value={tempOrder}
                          onChange={(e) => setTempOrder(e.target.value)}
                        />
                      </Form.Group>
                      <div>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={saveEdit}
                          className="me-2"
                        >
                          <FontAwesomeIcon icon={faSave} /> Lưu
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={cancelEdit}
                        >
                          <FontAwesomeIcon icon={faTimes} /> Hủy
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <>
                      <div className="blog-detail__caption mt-2">
                        {imagesBySection[idx].caption || (
                          <i>Chưa có chú thích</i>
                        )}
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => startEdit(imagesBySection[idx])}
                        className="mt-2"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Sửa ảnh
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Extra Images */}
      {leftoverImages.length > 0 && (
        <div className="blog-detail__extra-images mt-5">
          <h3 className="mb-4">Hình ảnh thêm</h3>
          <Row>
            {leftoverImages.map((img) => (
              <Col
                key={img.id}
                xs={12}
                sm={6}
                md={4}
                className="mb-4 d-flex flex-column align-items-center"
              >
                <Image
                  src={getStorageUrl(img.image)}
                  alt={img.caption || "extra image"}
                  fluid
                  rounded
                  className="blog-detail__image"
                />
                {editingImageId === img.id ? (
                  <Form className="blog-detail__form mt-3 w-100">
                    <Form.Group
                      controlId={`caption-${img.id}`}
                      className="mb-2"
                    >
                      <Form.Label>Caption</Form.Label>
                      <Form.Control
                        type="text"
                        value={tempCaption}
                        onChange={(e) => setTempCaption(e.target.value)}
                        placeholder="Nhập caption ảnh"
                      />
                    </Form.Group>
                    <Form.Group
                      controlId={`order-${img.id}`}
                      className="mb-3"
                    >
                      <Form.Label>Thứ tự hiển thị</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        value={tempOrder}
                        onChange={(e) => setTempOrder(e.target.value)}
                      />
                    </Form.Group>
                    <div>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={saveEdit}
                        className="me-2"
                      >
                        <FontAwesomeIcon icon={faSave} /> Lưu
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={cancelEdit}
                      >
                        <FontAwesomeIcon icon={faTimes} /> Hủy
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <div className="blog-detail__caption mt-2 w-100 text-center">
                      {img.caption || <i>Chưa có chú thích</i>}
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => startEdit(img)}
                      className="mt-2"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Sửa ảnh
                    </Button>
                  </>
                )}
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default BlogDetailPage;
