import LoginForm from "../../components/authComponent/LoginForm";
import AuthLayout from "../../layouts/AuthLayout";

const Login = () => {
  return (
    <AuthLayout imageUrl="https://cdn.brvn.vn/static/onboarding/brvn_thinking.jpg"
               title="Tuyển dụng và Tìm việc làm Marketing"
               description="Marketing đến Marketer. Truyền thông tới dân Quảng cáo. Làm Brand cho Agency. Tuyển dụng và Tìm việc làm Marketing dễ dàng tại Brands Vietnam."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
