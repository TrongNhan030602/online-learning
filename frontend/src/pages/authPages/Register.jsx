import RegisterForm from "../../components/Auth/RegisterForm";
import AuthLayout from "../../layouts/AuthLayout";

const Register = () => {
  return (
    <AuthLayout
      imageUrl="https://cdn.brvn.vn/static/onboarding/brvn_reading.jpg"
      title="Đăng ký tại Học viện Design24 – Khám phá hành trình sáng tạo"
      description="Tham gia Học viện Design24 để bắt đầu học hỏi từ các chuyên gia trong ngành thiết kế đồ họa và truyền thông đa phương tiện. Khám phá các khóa học đa dạng và bắt đầu con đường sự nghiệp của bạn ngay hôm nay."
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
