/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import materialApi from "@/api/materialApi";
import { useToast } from "@/hooks/useToast";

const MaterialModal = ({
  show,
  handleClose,
  lessonId,
  materialToEdit,
  onMaterialAdded,
  onMaterialUpdated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileLink, setFileLink] = useState("");
  const [type, setType] = useState("file");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (materialToEdit) {
      setTitle(materialToEdit.title);
      setDescription(materialToEdit.description || "");
      setType(materialToEdit.type);
      setFile(null); // reset file input
      if (materialToEdit.type === "link") {
        setFileLink(materialToEdit.file_path);
      } else {
        setFileLink("");
      }
    } else {
      setTitle("");
      setDescription("");
      setType("file");
      setFile(null);
      setFileLink("");
    }
  }, [materialToEdit]);

  const handleSave = async () => {
    if (!title) return alert("Tiêu đề là bắt buộc.");

    if (type === "link" && !fileLink) {
      return alert("Vui lòng nhập URL tài liệu.");
    }

    if (type === "file" && !file && !materialToEdit) {
      return alert("Vui lòng chọn tệp.");
    }

    setLoading(true);

    try {
      if (materialToEdit) {
        if (type === "link") {
          // Cập nhật tài liệu link (PUT)
          await materialApi.updateMaterial(materialToEdit.id, {
            title,
            description,
            type,
            file_path: fileLink,
          });
        } else {
          const formData = new FormData();
          formData.append("lesson_id", lessonId);
          formData.append("title", title);
          formData.append("description", description);
          formData.append("type", type);
          if (file) {
            formData.append("file_path", file);
          }
          await materialApi.updateMaterialWithFile(materialToEdit.id, formData);
        }

        onMaterialUpdated();
      } else {
        const formData = new FormData();
        formData.append("lesson_id", lessonId);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("type", type);
        if (type === "link") {
          formData.append("file_path", fileLink);
        } else {
          formData.append("file_path", file);
        }

        await materialApi.createMaterial(formData);
        onMaterialAdded();
      }
      addToast({
        title: "Thành công!",
        message: "Tài liệu đã được lưu",
        type: "success",
        duration: 1500,
      });
      handleClose();
    } catch (err) {
      console.error("Lỗi khi thêm/cập nhật tài liệu:", err);
      alert(
        err?.response?.data?.message ||
          "Có lỗi xảy ra khi lưu tài liệu. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
      setFile(null);
      setFileLink("");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {materialToEdit ? "Cập nhật tài liệu" : "Thêm tài liệu"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Form.Group
            className="mb-3"
            controlId="materialTitle"
          >
            <Form.Label>Tiêu đề tài liệu</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tiêu đề tài liệu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="materialDescription"
          >
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập mô tả tài liệu"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="materialType"
          >
            <Form.Label>Loại tài liệu</Form.Label>
            <Form.Control
              as="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="file">File</option>
              <option value="link">Link</option>
            </Form.Control>
          </Form.Group>

          {type === "file" && (
            <Form.Group
              className="mb-3"
              controlId="materialFile"
            >
              <Form.Label>Chọn file</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>
          )}

          {type === "link" && (
            <Form.Group
              className="mb-3"
              controlId="materialLink"
            >
              <Form.Label>Link tài liệu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập URL tài liệu"
                value={fileLink}
                onChange={(e) => setFileLink(e.target.value)}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Đóng
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={handleSave}
          disabled={
            loading ||
            !title ||
            (type === "link" && !fileLink) ||
            (type === "file" && !file)
          }
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MaterialModal;
