import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import lessonApi from "../../api/lessonApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/course/lesson-form-modal.css";

const schema = yup.object().shape({
  title: yup.string().required("Tiêu đề không được để trống"),
  order: yup
    .number()
    .typeError("Phải là số")
    .min(1, "Thứ tự phải lớn hơn 0")
    .required("Bắt buộc"),
  video_url: yup.string().url("URL video không hợp lệ").nullable(),
  document: yup.mixed().nullable(),
});

const LessonFormModal = ({
  show,
  courseId,
  initialData,
  handleClose,
  onSuccess,
}) => {
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      course_id: courseId,
      title: initialData?.title || "",
      content: initialData?.content || "",
      video_url: initialData?.video_url || "",
      order: initialData?.order || "",
      document: null,
    },
  });

  useEffect(() => {
    reset({
      course_id: courseId,
      title: initialData?.title || "",
      content: initialData?.content || "",
      video_url: initialData?.video_url || "",
      order: initialData?.order || "",
      document: null,
    });
    setError("");
  }, [show, initialData, courseId, reset]);

  const onSubmit = async (data) => {
    setError("");

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key]) formData.append(key, data[key]);
    });

    try {
      const response = initialData
        ? await lessonApi.updateLesson(initialData.id, formData)
        : await lessonApi.createLesson(formData);

      onSuccess(response.data);
      reset();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="lesson-form__title">
          {initialData ? "Cập nhật bài học" : "Thêm bài học mới"}
        </Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="lesson-form"
      >
        <Modal.Body>
          {error && (
            <Alert
              variant="danger"
              className="lesson-form__error"
            >
              {error}
            </Alert>
          )}

          <Form.Group className="lesson-form__group">
            <Form.Label className="lesson-form__label">Tiêu đề:</Form.Label>
            <Form.Control
              type="text"
              {...register("title")}
              className="lesson-form__input"
            />
            {errors.title && (
              <div className="text-danger small">{errors.title.message}</div>
            )}
          </Form.Group>

          <Form.Group className="lesson-form__group">
            <Form.Label className="lesson-form__label">Nội dung:</Form.Label>
            <Form.Control
              as="textarea"
              {...register("content")}
              className="lesson-form__textarea"
            />
          </Form.Group>

          <Form.Group className="lesson-form__group">
            <Form.Label className="lesson-form__label">Video URL:</Form.Label>
            <Form.Control
              type="url"
              {...register("video_url")}
              className="lesson-form__input"
            />
            {errors.video_url && (
              <div className="text-danger small">
                {errors.video_url.message}
              </div>
            )}
          </Form.Group>

          <Form.Group className="lesson-form__group">
            <Form.Label className="lesson-form__label">Thứ tự:</Form.Label>
            <Form.Control
              type="number"
              {...register("order")}
              className="lesson-form__input"
            />
            {errors.order && (
              <div className="text-danger small">{errors.order.message}</div>
            )}
          </Form.Group>

          <Form.Group className="lesson-form__group">
            <Form.Label className="lesson-form__label">Tài liệu:</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.mp4,.avi,.mov"
              onChange={(e) => setValue("document", e.target.files[0])}
              className="lesson-form__input"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="lesson-form__actions">
          <Button
            variant="none"
            onClick={handleClose}
            className="lesson-form__button lesson-form__button--cancel"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="none"
            disabled={isSubmitting}
            className="lesson-form__button lesson-form__button--submit"
          >
            {isSubmitting ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// 🔥 **Thêm kiểm tra kiểu dữ liệu bằng PropTypes**
LessonFormModal.propTypes = {
  show: PropTypes.bool.isRequired, // Trạng thái hiển thị modal
  courseId: PropTypes.number.isRequired, // ID của khóa học
  initialData: PropTypes.shape({
    // Dữ liệu bài học (nếu có)
    id: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string,
    video_url: PropTypes.string,
    order: PropTypes.number,
  }),
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

// Giá trị mặc định (tránh lỗi nếu không có initialData)
LessonFormModal.defaultProps = {
  initialData: null,
};

export default LessonFormModal;
