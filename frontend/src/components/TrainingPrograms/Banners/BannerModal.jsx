/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import trainingProgramBannerApi from "../../../api/trainingProgramBannerApi";

const BannerModal = ({ show, onHide, programId, selectedBanner, onSave }) => {
  const [bannerForm, setBannerForm] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    if (selectedBanner) {
      setBannerForm({
        title: selectedBanner.title || "",
        description: selectedBanner.description || "",
        image_url: selectedBanner.image_url || "",
      });
    } else {
      setBannerForm({ title: "", description: "", image_url: "" });
    }
  }, [selectedBanner]);

  const handleSave = async () => {
    try {
      if (selectedBanner) {
        const formData = new FormData();
        formData.append("title", bannerForm.title);
        formData.append("description", bannerForm.description);
        formData.append("image", bannerForm.image_url);
        await trainingProgramBannerApi.update(selectedBanner.id, formData);
      } else {
        const formData = new FormData();
        formData.append("training_program_id", programId);
        formData.append("title", bannerForm.title);
        formData.append("description", bannerForm.description);
        formData.append("image", bannerForm.image_url);
        await trainingProgramBannerApi.create(formData);
      }
      onSave();
      onHide();
    } catch (error) {
      console.error("Lỗi khi lưu banner", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedBanner) {
        await trainingProgramBannerApi.delete(selectedBanner.id);
        onSave();
        onHide();
      }
    } catch (error) {
      console.error("Lỗi khi xóa banner", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedBanner ? "Cập nhật banner" : "Thêm banner"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              value={bannerForm.title}
              onChange={(e) =>
                setBannerForm({ ...bannerForm, title: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              type="text"
              value={bannerForm.description}
              onChange={(e) =>
                setBannerForm({ ...bannerForm, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hình ảnh</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) =>
                setBannerForm({ ...bannerForm, image_url: e.target.files[0] })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {selectedBanner && (
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Xóa
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onHide}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
        >
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BannerModal;
