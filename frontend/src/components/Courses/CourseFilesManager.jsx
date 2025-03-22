import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Table, Spinner } from "react-bootstrap";
import { useToast } from "../../hooks/useToast";
import courseApi from "../../api/courseApi";
import courseFileApi from "../../api/courseFileApi";
import Loading from "../../components/Common/Loading";
import "../../styles/course/admin-course-files-manager.css";

const CourseFilesManager = ({ show, handleClose, courseId }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toastRef = useRef(useToast());

  const fetchFiles = useCallback(() => {
    if (!courseId) return;
    setLoading(true);
    courseApi
      .getCourseDetail(courseId)
      .then((res) => {
        setFiles(res.data.files || []);
      })
      .catch(() => {
        toastRef.current.addToast({
          title: "Lỗi",
          message: "Không thể tải danh sách tài liệu.",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (show) fetchFiles();
  }, [show, fetchFiles]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toastRef.current.addToast({
        title: "Cảnh báo",
        message: "Vui lòng chọn file trước khi tải lên.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

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
        toastRef.current.addToast({
          title: "Thành công",
          message: "Tải file lên thành công.",
          type: "success",
          duration: 3000,
        });
        fetchFiles();
        setSelectedFile(null);
      })
      .catch((err) => {
        toastRef.current.addToast({
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
        toastRef.current.addToast({
          title: "Thành công",
          message: "Xóa file thành công.",
          type: "success",
          duration: 3000,
        });
        fetchFiles();
      })
      .catch((err) => {
        toastRef.current.addToast({
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
        <Form className="course-files__upload">
          <Form.Group
            controlId="fileUpload"
            className="course-files__upload-group"
          >
            <Form.Label className="course-files__upload-label">
              Chọn file để tải lên
            </Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
              className="course-files__upload-input"
            />
          </Form.Group>
          <Button
            variant="primary"
            className="course-files__upload-button"
            onClick={handleUpload}
            disabled={uploading}
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
        <h5 className="course-files__title">Danh sách tài liệu</h5>
        {loading ? (
          <Loading
            text="Đang tải dữ liệu..."
            size="lg"
            className="course-files__loading"
            variant="danger"
            textVariant="danger"
          />
        ) : files.length > 0 ? (
          <Table
            striped
            bordered
            hover
            responsive
            className="course-files__table"
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
                <tr
                  key={file.id}
                  className="course-files__row"
                >
                  <td className="course-files__id">{file.id}</td>
                  <td className="course-files__type">{file.type}</td>
                  <td className="course-files__name">
                    {file.name || file.file_path.split("/").pop()}
                  </td>
                  <td className="course-files__actions">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      className="course-files__delete-button"
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="course-files__empty">Không có tài liệu nào.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          className="course-files__close-button"
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
