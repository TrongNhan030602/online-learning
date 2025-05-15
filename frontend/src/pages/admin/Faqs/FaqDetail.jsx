import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import faqApi from "@/api/faqApi";
import Loading from "@/components/Common/Loading";
import "../../../styles/faqs/faq-detail.css";

const FaqDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    faqApi
      .getFaqById(id)
      .then((res) => {
        setFaq(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết FAQ:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Loading
        text="Đang tải dữ liệu..."
        size="lg"
        variant="primary"
        textVariant="primary"
      />
    );

  return (
    <div className="faq-detail">
      <div className="faq-card">
        {/* Nút quay lại + Tiêu đề */}
        <div className="faq-header">
          <button
            className="faq-back-btn"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
          </button>
          <h2 className="faq-question">
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="faq-icon"
            />{" "}
            {faq?.question}
          </h2>
        </div>

        {/* Nội dung câu trả lời */}
        <div className="faq-content">
          <p className="faq-answer">{faq?.answer}</p>
        </div>

        {/* Thông tin bổ sung */}
        <div className="faq-meta">
          <span className="faq-category">📌 Chủ đề: {faq?.category}</span>
          <span
            className={`faq-status ${
              faq?.status === 1 ? "active" : "inactive"
            }`}
          >
            {faq?.status === 1 ? "🔵 Hoạt động" : "🔴 Tạm dừng"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FaqDetail;
