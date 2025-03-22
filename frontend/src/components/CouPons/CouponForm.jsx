import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button } from "react-bootstrap";
import couponApi from "../../api/couponApi";
import { useToast } from "../../hooks/useToast";
import "../../styles/coupon/coupon-form.css";

const couponSchema = yup.object().shape({
  code: yup
    .string()
    .trim()
    .min(3, "Mã giảm giá phải có ít nhất 3 ký tự.")
    .matches(/^[a-zA-Z0-9]+$/, "Mã giảm giá chỉ được chứa chữ cái và số.")
    .required("Mã giảm giá không được để trống."),
  discount: yup
    .number()
    .typeError("Giá trị giảm giá phải là số.")
    .positive("Giá trị giảm giá phải lớn hơn 0.")
    .max(100, "Giá trị giảm giá không được vượt quá 100%")
    .required("Giá trị giảm giá không được để trống."),
  expires_at: yup.string().required("Vui lòng chọn ngày hết hạn."),
  usage_limit: yup
    .number()
    .typeError("Giới hạn sử dụng phải là số.")
    .positive("Giới hạn sử dụng phải lớn hơn 0.")
    .integer("Giới hạn sử dụng phải là số nguyên.")
    .required("Giới hạn sử dụng không được để trống."),
});

const CouponForm = ({ initialData, onSuccess, onClose }) => {
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(couponSchema),
    defaultValues: {
      code: "",
      discount: "",
      expires_at: "",
      usage_limit: "",
    },
  });

  // Reset form khi có initialData
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        expires_at: initialData.expires_at.split("T")[0],
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    try {
      if (initialData?.id) {
        await couponApi.updateCoupon(initialData.id, data);
      } else {
        await couponApi.createCoupon(data);
      }

      addToast({
        title: "Thành công!",
        message: initialData
          ? "Mã giảm giá đã được cập nhật."
          : "Mã giảm giá mới đã được thêm.",
        type: "success",
        duration: 3000,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi khi lưu mã giảm giá:", err);
      if (err.response && err.response.data.errors) {
        Object.keys(err.response.data.errors).forEach((field) => {
          setError(field, {
            type: "server",
            message: err.response.data.errors[field],
          });
        });
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
      onSubmit={handleSubmit(onSubmit)}
      className="coupon-form"
    >
      <Form.Group
        controlId="code"
        className="coupon-form__group"
      >
        <Form.Label className="coupon-form__label">Mã giảm giá</Form.Label>
        <Form.Control
          type="text"
          {...register("code")}
          className={`coupon-form__input ${errors.code ? "is-invalid" : ""}`}
        />
        {errors.code && (
          <div className="invalid-feedback">{errors.code.message}</div>
        )}
      </Form.Group>

      <Form.Group
        controlId="discount"
        className="coupon-form__group"
      >
        <Form.Label className="coupon-form__label">Giảm giá (%)</Form.Label>
        <Form.Control
          type="number"
          {...register("discount")}
          className={`coupon-form__input ${
            errors.discount ? "is-invalid" : ""
          }`}
        />
        {errors.discount && (
          <div className="invalid-feedback">{errors.discount.message}</div>
        )}
      </Form.Group>

      <Form.Group
        controlId="expires_at"
        className="coupon-form__group"
      >
        <Form.Label className="coupon-form__label">Ngày hết hạn</Form.Label>
        <Form.Control
          type="date"
          {...register("expires_at")}
          className={`coupon-form__input ${
            errors.expires_at ? "is-invalid" : ""
          }`}
        />
        {errors.expires_at && (
          <div className="invalid-feedback">{errors.expires_at.message}</div>
        )}
      </Form.Group>

      <Form.Group
        controlId="usage_limit"
        className="coupon-form__group"
      >
        <Form.Label className="coupon-form__label">Giới hạn sử dụng</Form.Label>
        <Form.Control
          type="number"
          {...register("usage_limit")}
          className={`coupon-form__input ${
            errors.usage_limit ? "is-invalid" : ""
          }`}
        />
        {errors.usage_limit && (
          <div className="invalid-feedback">{errors.usage_limit.message}</div>
        )}
      </Form.Group>

      <div className="coupon-form__actions">
        <Button
          type="submit"
          className="coupon-form__button coupon-form__button--submit"
          disabled={isSubmitting}
          variant="none"
        >
          {isSubmitting
            ? "Đang xử lý..."
            : initialData
            ? "Cập nhật"
            : "Thêm mới"}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="coupon-form__button coupon-form__button--cancel"
          disabled={isSubmitting}
          variant="none"
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
