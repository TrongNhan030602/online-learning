import { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import userProfileApi from "@/api/userProfileApi";
import { useToast } from "@/hooks/useToast";

// eslint-disable-next-line react/prop-types
const ChangeOwnPasswordForm = ({ onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới có đủ mạnh không
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setError(
        "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      setSuccess("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setSuccess("");
      return;
    }

    try {
      await userProfileApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      setSuccess("Đổi mật khẩu thành công.");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      addToast({
        title: "Thành công!",
        message: "Mật khẩu đã được đổi",
        type: "success",
        duration: 1500,
      });
      onSuccess?.();
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Có lỗi xảy ra. Vui lòng thử lại.";

      setError(message);
      setSuccess("");
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4>Đổi mật khẩu</h4>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu hiện tại</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Ít nhất 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
          >
            Đổi mật khẩu
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChangeOwnPasswordForm;
