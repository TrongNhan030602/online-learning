import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";
import couponApi from "../../api/couponApi";
import { useToast } from "../../hooks/useToast";
import "../../styles/coupon/coupon-form.css";

const CouponForm = ({ initialData, onSuccess, onClose }) => {
  const { addToast } = useToast();
  const [coupon, setCoupon] = useState({
    code: "",
    discount: "",
    expires_at: "",
    usage_limit: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setCoupon({
        ...initialData,
        expires_at: initialData.expires_at.split("T")[0],
      });
    } else {
      setCoupon({
        code: "",
        discount: "",
        expires_at: "",
        usage_limit: "",
      });
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    let newErrors = {};
    if (!coupon.code.trim()) {
      newErrors.code = "Mã giảm giá không được để trống.";
    } else if (coupon.code.length < 3) {
      newErrors.code = "Mã giảm giá phải có ít nhất 3 ký tự.";
    } else if (!/^[a-zA-Z0-9]+$/.test(coupon.code)) {
      newErrors.code = "Mã giảm giá chỉ được chứa chữ cái và số.";
    }

    if (!coupon.discount || isNaN(coupon.discount) || coupon.discount <= 0) {
      newErrors.discount = "Giá trị giảm giá phải lớn hơn 0.";
    } else if (coupon.discount > 100) {
      newErrors.discount = "Giá trị giảm giá không được vượt quá 100%";
    }

    if (!coupon.expires_at) {
      newErrors.expires_at = "Vui lòng chọn ngày hết hạn.";
    }

    if (
      !coupon.usage_limit ||
      isNaN(coupon.usage_limit) ||
      coupon.usage_limit <= 0
    ) {
      newErrors.usage_limit = "Giới hạn sử dụng phải lớn hơn 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Check if we are editing or creating a new coupon
      if (initialData?.id) {
        await couponApi.updateCoupon(initialData.id, coupon);
      } else {
        await couponApi.createCoupon(coupon); // This sends the POST request
      }

      addToast({
        title: "Thành công!",
        message: initialData
          ? "Mã giảm giá đã được cập nhật."
          : "Mã giảm giá mới đã được thêm.",
        type: "success",
        duration: 3000,
      });

      onSuccess(); // Handle success logic
      onClose(); // Close the form/modal
    } catch (err) {
      console.error("Lỗi khi lưu mã giảm giá:", err);
      if (err.response && err.response.data) {
        setErrors(err.response.data.errors || {}); // Set API errors
      } else {
        addToast({
          title: "Lỗi!",
          message: "Có lỗi xảy ra, vui lòng thử lại.",
          type: "error",
          duration: 3000,
        });
      }
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="coupon-form"
    >
      <Form.Group
        controlId="code"
        className="coupon-form__group"
      >
        <Form.Label className="coupon-form__label">Mã giảm giá</Form.Label>
        <Form.Control
          type="text"
          name="code"
          value={coupon.code}
          onChange={handleChange}
          className={`coupon-form__input ${errors.code ? "is-invalid" : ""}`}
          required
        />
        {errors.code && <div className="invalid-feedback">{errors.code}</div>}
      </Form.Group>

      <Form.Group
        controlId="discount"
        className="coupon-form__group"
      >
        <Form.Label className="coupon-form__label">Giảm giá (%)</Form.Label>
        <Form.Control
          type="number"
          name="discount"
          value={coupon.discount}
          onChange={handleChange}
          className={`coupon-form__input ${
            errors.discount ? "is-invalid" : ""
          }`}
          required
          min={1}
        />
        {errors.discount && (
          <div className="invalid-feedback">{errors.discount}</div>
        )}
      </Form.Group>

      <Form.Group
        controlId="expires_at"
        className="coupon-form__group"
      >
        <Form.Label className="coupon-form__label">Ngày hết hạn</Form.Label>
        <Form.Control
          type="date"
          name="expires_at"
          value={coupon.expires_at}
          onChange={handleChange}
          className={`coupon-form__input ${
            errors.expires_at ? "is-invalid" : ""
          }`}
          required
        />
        {errors.expires_at && (
          <div className="invalid-feedback">{errors.expires_at}</div>
        )}
      </Form.Group>

      <Form.Group
        controlId="usage_limit"
        className="coupon-form__group"
      >
        <Form.Label className="coupon-form__label">Giới hạn sử dụng</Form.Label>
        <Form.Control
          type="number"
          name="usage_limit"
          value={coupon.usage_limit}
          onChange={handleChange}
          className={`coupon-form__input ${
            errors.usage_limit ? "is-invalid" : ""
          }`}
          required
        />
        {errors.usage_limit && (
          <div className="invalid-feedback">{errors.usage_limit}</div>
        )}
      </Form.Group>

      <div className="coupon-form__actions">
        <Button
          type="submit"
          className="coupon-form__button coupon-form__button--submit"
        >
          {initialData ? "Cập nhật" : "Thêm mới"}
        </Button>
        <Button
          onClick={onClose}
          className="coupon-form__button coupon-form__button--cancel"
        >
          Hủy
        </Button>
      </div>
    </Form>
  );
};

CouponForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CouponForm;
