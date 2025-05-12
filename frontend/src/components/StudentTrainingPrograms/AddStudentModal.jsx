/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import studentTrainingProgramApi from "../../api/studentTrainingProgramApi";
import { useToast } from "../../hooks/useToast";

const AddStudentModal = ({
  programId,
  showModal,
  handleCloseModal,
  handleAddStudentSuccess,
}) => {
  const [studentsNotInProgram, setStudentsNotInProgram] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(null);
  const [entryType, setEntryType] = useState("default");
  const [fromProgramId, setFromProgramId] = useState(null);
  const [previousPrograms, setPreviousPrograms] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStudentsNotInProgram = async () => {
      try {
        const response =
          await studentTrainingProgramApi.getStudentsNotInProgram(programId);
        setStudentsNotInProgram(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentsNotInProgram();
  }, [programId]);

  const fetchPreviousProgramsByStudent = async (studentId) => {
    try {
      const response = await studentTrainingProgramApi.getPreviousProgram(
        studentId
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        setPreviousPrograms(response.data);
      } else {
        setPreviousPrograms([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy chương trình đào tạo trước:", error);
      setPreviousPrograms([]);
    }
  };

  const handleEntryTypeChange = async (selected) => {
    setEntryType(selected.value);

    if (selected.value === "lien_thong") {
      if (!selectedStudents || !selectedStudents.value) {
        addToast({
          title: "Cảnh báo! ",
          message:
            "Nếu liên thông bạn cần chọn học viên trước để lấy thông tin",
          type: "warning",
          duration: 4000,
        });
        return;
      }
      await fetchPreviousProgramsByStudent(selectedStudents.value);
    } else {
      setPreviousPrograms([]);
      setFromProgramId(null);
    }
  };

  const handleFromProgramChange = (selected) => {
    setFromProgramId(selected ? selected.training_program_id : null);
  };
  const handleStudentChange = async (selected) => {
    setSelectedStudents(selected);
    if (entryType === "lien_thong" && selected && selected.value) {
      await fetchPreviousProgramsByStudent(selected.value);
    }
  };

  const handleAddStudents = async () => {
    try {
      if (!selectedStudents) {
        alert("Vui lòng chọn học viên.");
        return;
      }

      if (entryType === "lien_thong" && !fromProgramId) {
        alert("Vui lòng chọn chương trình đào tạo trước.");
        return;
      }

      const data = {
        user_id: selectedStudents.value,
        training_program_id: programId,
        entry_type: entryType,
        from_program_id: fromProgramId,
      };

      await studentTrainingProgramApi.registerStudentToProgram(data);
      handleAddStudentSuccess(); // Gọi callback để cập nhật danh sách học viên
      addToast({
        title: "Thành công!",
        message: "Học viên đã được thêm",
        type: "success",
        duration: 1500,
      });
      setSelectedStudents(null);
      setEntryType("default");
      setFromProgramId(null);
    } catch (err) {
      console.error(err);
    }
  };
  const getEntryTypeLabel = (type) => {
    switch (type) {
      case "default":
        return "Chính quy";
      case "lien_thong":
        return "Liên thông";
      case "van_bang_2":
        return "Văn bằng 2";
      default:
        return "Không xác định";
    }
  };
  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Chọn học viên để thêm vào chương trình</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group mb-3">
          <label>Chọn học viên</label>
          <Select
            options={studentsNotInProgram.map((student) => ({
              value: student.id,
              label: `${student.name} (${student.email})`,
            }))}
            value={selectedStudents}
            onChange={handleStudentChange}
            placeholder="Chọn học viên"
          />
        </div>
        <div className="form-group mb-3">
          <label>Loại nhập học</label>
          <Select
            value={{ value: entryType, label: getEntryTypeLabel(entryType) }}
            onChange={handleEntryTypeChange}
            options={[
              { value: "default", label: "Chính quy" },
              { value: "lien_thong", label: "Liên thông" },
              { value: "van_bang_2", label: "Văn bằng 2" },
            ]}
          />
        </div>
        {entryType === "lien_thong" &&
          selectedStudents &&
          selectedStudents.value && (
            <div className="form-group mb-3">
              <label>Chọn chương trình đào tạo đã hoàn thành trước đó</label>
              <Select
                options={
                  previousPrograms.length > 0
                    ? previousPrograms
                    : [
                        {
                          training_program: {
                            name: "Không thể liên thông - Chưa có chương trình đào tạo nào trước đây",
                            code: "",
                          },
                          training_program_id: "",
                        },
                      ]
                }
                value={
                  previousPrograms.find(
                    (p) =>
                      Number(p.training_program_id) === Number(fromProgramId)
                  ) || null
                }
                onChange={handleFromProgramChange}
                placeholder="Chọn chương trình đào tạo trước"
                getOptionLabel={(program) =>
                  `${program.training_program.name} (${program.training_program.code})`
                }
                getOptionValue={(program) =>
                  String(program.training_program_id)
                }
              />
            </div>
          )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleCloseModal}
        >
          Đóng
        </Button>
        <Button
          variant="primary"
          onClick={handleAddStudents}
        >
          Thêm học viên
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddStudentModal;
