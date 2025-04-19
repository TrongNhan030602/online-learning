/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import userApi from "../../api/userApi";
import enrollmentApi from "../../api/enrollmentApi"; // Import API ghi danh
import { useToast } from "../../hooks/useToast";

const AddStudentModal = ({
  show,
  handleClose,
  classroomId,
  onStudentAdded,
  enrolledStudents = [], // 👈 thêm danh sách học viên đã có trong lớp
}) => {
  const { addToast } = useToast();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Tải danh sách người dùng
  useEffect(() => {
    if (show) {
      setLoading(true);
      userApi
        .getUsers()
        .then((res) => {
          setAllUsers(res.data);
        })
        .catch((err) => {
          console.error("Lỗi khi tải danh sách người dùng:", err);
          addToast({
            title: "Lỗi",
            message: "Không thể tải danh sách người dùng.",
            type: "error",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [show, addToast]);

  const handleAddStudent = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      // Thay đổi API từ classApi.addStudentToClass thành enrollmentApi.enroll
      await enrollmentApi.enroll({
        classroom_id: classroomId,
        user_id: selectedUser.value,
      });

      addToast({
        title: "Thành công",
        message: "Học viên đã được ghi danh vào lớp.",
        type: "success",
      });

      onStudentAdded?.();
      handleClose();
      setSelectedUser(null);
    } catch (err) {
      console.error("Lỗi khi ghi danh học viên:", err);
      addToast({
        title: "Lỗi",
        message: "Không thể ghi danh học viên vào lớp.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 👇 Lọc user chưa có trong lớp
  const enrolledUserIds = enrolledStudents.map((s) => s.id);

  const userOptions = allUsers
    .filter((user) => !enrolledUserIds.includes(user.id))
    .map((user) => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
    }));

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faUserPlus} /> Thêm học viên vào lớp
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p className="mt-2">Đang tải danh sách người dùng...</p>
          </div>
        ) : userOptions.length === 0 ? (
          <p className="text-center text-muted">
            Tất cả học viên đã được thêm vào lớp.
          </p>
        ) : (
          <Form>
            <Form.Group controlId="selectStudent">
              <Form.Label>Chọn học viên</Form.Label>
              <Select
                options={userOptions}
                value={selectedUser}
                onChange={setSelectedUser}
                placeholder="Chọn người dùng..."
              />
            </Form.Group>
          </Form>
        )}
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
          onClick={handleAddStudent}
          disabled={!selectedUser || submitting}
        >
          {submitting ? "Đang thêm..." : <>Thêm học viên</>}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddStudentModal;
