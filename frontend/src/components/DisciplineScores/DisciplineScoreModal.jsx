import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import disciplineScoreApi from "@/api/disciplineScoreApi";
import { useToast } from "@/hooks/useToast";

const DisciplineScoreModal = ({ isOpen, onClose, item, onUpdate }) => {
  const [score, setScore] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const { addToast } = useToast();
  console.log("item", item);
  useEffect(() => {
    if (item) {
      setScore(item.score);
      setEvaluation(item.evaluation);
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;

    // Kiểm tra dữ liệu trước khi gửi yêu cầu cập nhật
    if (score === "" || evaluation === "") {
      addToast({
        title: "Lỗi!",
        message: "Điểm và đánh giá không được để trống.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    const updatedData = {
      student_training_program_id: item.student_training_program_id,
      semester_id: item.semester_id,
      score: score,
      evaluation: evaluation,
    };

    try {
      await disciplineScoreApi.updateDisciplineScore(item.id, updatedData);
      addToast({
        title: "Thành công!",
        message: "Cập nhật điểm rèn luyện thành công.",
        type: "success",
        duration: 3000,
      });
      onUpdate(updatedData); // Gọi hàm onUpdate từ component cha
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Cập nhật không thành công", error);
      addToast({
        title: "Lỗi!",
        message: "Cập nhật không thành công. Vui lòng thử lại sau.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      size="md"
    >
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật điểm rèn luyện</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {item ? (
          <>
            <InputGroup className="mb-3">
              <InputGroup.Text>Điểm</InputGroup.Text>
              <FormControl
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Nhập điểm"
                autoFocus
                onKeyDown={handleKeyPress}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Đánh giá</InputGroup.Text>
              <FormControl
                type="text"
                value={evaluation}
                onChange={(e) => setEvaluation(e.target.value)}
                placeholder="Nhập đánh giá"
                onKeyDown={handleKeyPress}
              />
            </InputGroup>
          </>
        ) : (
          <div>Không có thông tin để hiển thị</div> // Thông báo nếu không có dữ liệu
        )}
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
          onClick={handleSave}
          disabled={score === "" || evaluation === ""}
        >
          Cập nhật
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DisciplineScoreModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
};

export default DisciplineScoreModal;
