/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import semesterApi from "../../api/semesterApi";
import { useToast } from "../../hooks/useToast";

const SemesterModal = ({
  show,
  onHide,
  programId,
  selectedSemester,
  onSave,
}) => {
  const [name, setName] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    if (selectedSemester) {
      setName(selectedSemester.name || "");
    } else {
      setName(""); // reset form khi thêm mới
    }
  }, [selectedSemester]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedSemester) {
        // Update
        await semesterApi.updateSemester(selectedSemester.id, { name });
      } else {
        // Create
        await semesterApi.createSemester({
          training_program_id: programId,
          name,
        });
      }
      onSave();
      addToast({
        title: "Thành công!",
        message: "Học kỳ đã được lưu.",
        type: "success",
        duration: 1500,
      });
      onHide();
    } catch (error) {
      console.error("Lỗi khi lưu học kỳ:", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedSemester ? "Chỉnh sửa học kỳ" : "Thêm học kỳ"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Tên học kỳ</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Học kỳ 01"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onHide}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SemesterModal;
