import { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Image,
  Badge,
  Button,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faUserTie,
  faCamera,
  faKey,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import authApi from "@/api/authApi";
import userProfileApi from "@/api/userProfileApi";
import { getStorageUrl } from "@/utils/getStorageUrl";
import ProfileUpdateModal from "@/components/Student/Profile/ModalUpdateInfo";
import ChangeOwnPasswordForm from "@/components/Student/Profile/ChangeOwnPasswordForm";

import "@/styles/student/student-profile.css";

const StudentProfile = () => {
  const [studentData, setStudentData] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await authApi.getPersonalInfo();
        setStudentData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    fetchPersonalInfo();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Vui lòng chọn một file ảnh hợp lệ.");
      return;
    }
    setAvatarFile(file);
  };

  const handleSubmitAvatar = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const response = await userProfileApi.updateAvatar(formData);
      setStudentData((prevState) => ({
        ...prevState,
        profile: {
          ...prevState.profile,
          avatar: response.data.avatar,
        },
      }));
      setShowModal(false);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  if (!studentData)
    return <div className="text-center py-5">Đang tải dữ liệu...</div>;

  const email = studentData?.email || "";
  const profile = studentData?.profile || {};
  const training_programs = Array.isArray(studentData?.training_programs)
    ? studentData.training_programs
    : [];

  const getGenderLabel = (gender) => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "other":
        return "Khác";
      default:
        return "Chưa xác định";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Chưa rõ";
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <Container className="student-profile py-5">
      <Card className="p-4 shadow-lg rounded-4 border-0 profile-card">
        <Row className="align-items-center">
          <Col
            md={4}
            className="text-center mb-4 mb-md-0"
          >
            <Image
              src={
                profile?.avatar
                  ? getStorageUrl(profile.avatar)
                  : "/default_avatar.jpg"
              }
              roundedCircle
              fluid
              alt="Avatar"
              className="profile-avatar shadow"
            />
            <h3 className="mt-3 fw-bold">
              {profile?.last_name || ""} {profile?.first_name || ""}
              {!profile?.last_name && !profile?.first_name && "Chưa có"}
            </h3>
            <p className="text-muted">
              <FontAwesomeIcon icon={faUserTie} />{" "}
              {profile?.position || "Chưa có"}
            </p>

            {/* Button to trigger avatar change */}
            <Button
              variant="outline-primary"
              className="mt-3"
              onClick={() => setShowModal(true)}
            >
              <FontAwesomeIcon icon={faCamera} /> Đổi ảnh đại diện
            </Button>
          </Col>

          <Col md={8}>
            <h4 className="section-title">
              <FontAwesomeIcon
                icon={faUserTie}
                className="me-2"
              />
              Thông tin cá nhân
            </h4>
            <div className="d-flex gap-2 mb-3">
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => setShowProfileModal(true)}
              >
                <FontAwesomeIcon
                  icon={faUserPen}
                  className="me-1"
                />
                Cập nhật thông tin
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setShowPasswordModal(true)}
              >
                <FontAwesomeIcon
                  icon={faKey}
                  className="me-1"
                />
                Đổi mật khẩu
              </Button>
            </div>

            <Row>
              <Col sm={6}>
                <p>
                  <strong>Email hệ thống:</strong> {email || "Chưa có"}
                </p>
                <p>
                  <strong>Giới tính:</strong> {getGenderLabel(profile.gender)}
                </p>
              </Col>
              <Col sm={6}>
                <p>
                  <strong>Địa chỉ:</strong> {profile.address || "Chưa có"}
                </p>
                <p>
                  <strong>Ngày tạo hồ sơ:</strong>{" "}
                  {profile.created_at
                    ? formatDate(profile.created_at)
                    : "Chưa có"}
                </p>
              </Col>
              <Col sm={12}>
                <p>
                  <strong>Giới thiệu:</strong> {profile.info || "Chưa có"}
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Modal for avatar upload */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Đổi ảnh đại diện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            onChange={handleAvatarChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitAvatar}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Contact information */}
      <Row className="mt-4 gy-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0 rounded-4 info-card">
            <Card.Body>
              <Card.Title className="section-title">
                Thông tin liên hệ
              </Card.Title>
              <p>
                <FontAwesomeIcon
                  icon={faPhone}
                  className="me-2"
                />
                <strong>Điện thoại:</strong> {profile.phone || "Chưa có"}
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="me-2"
                />
                <strong>Email cá nhân:</strong> {email || "Chưa có"}
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="me-2"
                />
                <strong>Địa chỉ:</strong> {profile.address || "Chưa có"}
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm border-0 rounded-4 info-card">
            <Card.Body>
              <Card.Title className="section-title">
                Chương trình đào tạo
              </Card.Title>
              {Array.isArray(training_programs) &&
              training_programs.length > 0 ? (
                training_programs.map((program) => (
                  <div
                    key={program.id}
                    className="mb-3"
                  >
                    <h6 className="fw-semibold">{program.name}</h6>
                    <Badge
                      bg="secondary"
                      className="mb-1"
                    >
                      {program.level}
                    </Badge>
                    <p className="mb-0">
                      <strong>Mã chương trình:</strong> {program.code}
                    </p>
                    <hr />
                  </div>
                ))
              ) : (
                <p>Chưa có chương trình đào tạo</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Advisor Information */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm border-0 rounded-4 info-card">
            <Card.Body>
              <Card.Title className="section-title">
                Thông tin cố vấn học tập
              </Card.Title>
              {training_programs.length > 0 ? (
                training_programs.map((program) => (
                  <Card
                    key={program.id}
                    className="mb-3 border-0 bg-light rounded-3 px-3 py-2 advisor-card"
                  >
                    <strong>{program.name}</strong>
                    {program.advisor ? (
                      <p>
                        <FontAwesomeIcon
                          icon={faUserTie}
                          className="me-2"
                        />
                        {program.advisor}
                      </p>
                    ) : (
                      <p className="text-muted">Chưa có thông tin cố vấn</p>
                    )}

                    <p>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="me-2"
                      />
                      {program.advisor_email || "Chưa có"}
                    </p>
                  </Card>
                ))
              ) : (
                <p>Chưa có thông tin cố vấn học tập</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ProfileUpdateModal
        showModal={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          // Reload lại thông tin sau khi cập nhật
          const fetchPersonalInfo = async () => {
            try {
              const response = await authApi.getPersonalInfo();
              setStudentData(response.data);
            } catch (error) {
              console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
          };
          fetchPersonalInfo();
        }}
      />
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChangeOwnPasswordForm
            onSuccess={() => setShowPasswordModal(false)}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default StudentProfile;
