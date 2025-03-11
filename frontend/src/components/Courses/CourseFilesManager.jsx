import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Table, Spinner } from "react-bootstrap";
import { useToast } from "../../hooks/useToast"; // Import useToast
import courseApi from "../../api/courseApi";
import courseFileApi from "../../api/courseFileApi";
import Loading from "../../components/Common/Loading";

const CourseFilesManager = ({ show, handleClose, courseId }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const fetchFiles = useCallback(() => {
    setLoading(true);
    courseApi
      .getCourseDetail(courseId)
      .then((res) => {
        setFiles(res.data.files || []);
      })
      .catch(() => {
        addToast({
          title: "Lỗi",
          message: "Không thể tải danh sách tài liệu.",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => setLoading(false));
  }, [courseId, addToast]); // ✅ Đảm bảo chỉ thay đổi khi courseId hoặc addToast thay đổi

  useEffect(() => {
    if (show) fetchFiles();
  }, [show, fetchFiles]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    const fileType = selectedFile.type.startsWith("image/")
      ? "image"
      : "document";
    formData.append("type", fileType);
    formData.append("file", selectedFile);

    courseFileApi
      .uploadFile(courseId, formData)
      .then(() => {
        addToast({
          title: "Thành công",
          message: "Tải file lên thành công.",
          type: "success",
          duration: 3000,
        });
        fetchFiles();
        setSelectedFile(null);
      })
      .catch((err) => {
        addToast({
          title: "Lỗi",
          message: err.response?.data?.message || "Tải file thất bại.",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => setUploading(false));
  };

  const handleDelete = (fileId) => {
    courseFileApi
      .deleteFile(courseId, fileId)
      .then(() => {
        addToast({
          title: "Thành công",
          message: "Xóa file thành công.",
          type: "success",
          duration: 3000,
        });
        fetchFiles();
      })
      .catch((err) => {
        addToast({
          title: "Lỗi",
          message: err.response?.data?.message || "Xóa file thất bại.",
          type: "error",
          duration: 3000,
        });
      });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Quản lý tài liệu khóa học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="fileUpload">
            <Form.Label>Chọn file để tải lên</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="mt-2 custom-btn custom-btn-primary"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <Spinner
                animation="border"
                size="sm"
              />
            ) : (
              "Tải lên"
            )}
          </Button>
        </Form>
        <hr />
        <h5>Danh sách tài liệu</h5>
        {loading ? (
          <div>
            <Loading
              text="Đang tải dữ liệu..."
              size="lg"
            />
          </div>
        ) : files.length > 0 ? (
          <Table
            striped
            bordered
            hover
            responsive
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Loại</th>
                <th>Tên file</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>{file.id}</td>
                  <td>{file.type}</td>
                  <td>{file.file_path.split("/").pop()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Không có tài liệu nào.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

CourseFilesManager.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  courseId: PropTypes.number.isRequired,
};

export default CourseFilesManager;
