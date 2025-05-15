/* eslint-disable react/prop-types */
import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import userApi from "@/api/userApi";
import { useToast } from "@/hooks/useToast";

const ChangePasswordModal = ({ show, onClose, userId, userName }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { addToast } = useToast();

  const resetForm = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const handleReset = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setSuccess("");
      return;
    }

    try {
      await userApi.resetPassword(userId, {
        password,
        password_confirmation: confirmPassword,
      });
      setSuccess("Đổi mật khẩu thành công.");
      setError("");
      handleClose();
      addToast({
        title: "Thành công!",
        message: "Mật khẩu đã được đổi",
        type: "success",
        duration: 1500,
      });
    } catch (err) {
      console.error("Lỗi reset password:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setSuccess("");
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Đổi mật khẩu cho {userName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Text className="text-muted">
              Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc
              biệt.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleReset}
        >
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
