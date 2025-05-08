/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import userProfileApi from "../../../api/userProfileApi";
import { useToast } from "../../../hooks/useToast";

const ProfileUpdateModal = ({ showModal, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    gender: "male",
    position: "",
    info: "",
  });
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userProfileApi.getProfile();
        if (response.status === 200) {
          const userProfile = response.data;
          setFormData({
            first_name: userProfile.first_name || "",
            last_name: userProfile.last_name || "",
            phone: userProfile.phone || "",
            address: userProfile.address || "",
            gender: userProfile.gender || "male",
            position: userProfile.position || "",
            info: userProfile.info || "",
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    if (showModal) {
      fetchUserProfile();
    }
  }, [showModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await userProfileApi.updateProfile(formData);
      if (response.status === 200) {
        onClose();
        addToast({
          title: "Thành công!",
          message: "Thông tin đã được cập nhật.",
          type: "success",
          duration: 1500,
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Modal
      show={showModal}
      onHide={onClose}
    >
      <Form onSubmit={handleFormSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin cá nhân</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            className="mb-3"
            controlId="last_name"
          >
            <Form.Label>Họ</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="first_name"
          >
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="phone"
          >
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="address"
          >
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="gender"
          >
            <Form.Label>Giới tính</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </Form.Control>
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="position"
          >
            <Form.Label>Chức vụ</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="info"
          >
            <Form.Label>Giới thiệu</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="info"
              value={formData.info}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            type="submit"
          >
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProfileUpdateModal;
