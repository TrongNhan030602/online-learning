import RegisterForm from "../../components/Auth/RegisterForm";
import AuthLayout from "../../layouts/AuthLayout";

const Register = () => {
  return (
    <AuthLayout
      imageUrl="https://cdn.brvn.vn/static/onboarding/brvn_reading.jpg"
      title="Nghiên cứu và Kết nối cho Công việc"
      description="200+ case-study phân tích các chiến dịch Marketing kinh điển. 700+ danh bạ Agency kết nối với Brand. Tất cả những gì một người làm Marketing cần đều có trên Brands Vietnam."
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
