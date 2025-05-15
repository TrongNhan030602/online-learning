import LoginForm from "@/components/Auth/LoginForm";
import AuthLayout from "@/layouts/AuthLayout";

const Login = () => {
  return (
    <AuthLayout
      imageUrl="https://cdn.brvn.vn/static/onboarding/brvn_thinking.jpg"
      title="Học viện Design24 - Cổng đăng nhập học viên"
      description="Đăng nhập để truy cập khóa học, theo dõi tiến độ, nhận thông báo mới nhất và kết nối cùng cộng đồng sáng tạo tại Học viện Design24."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
