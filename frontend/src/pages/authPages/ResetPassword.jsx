import ResetPasswordForm from "../../components/authComponent/ResetPasswordForm";
import AuthLayout from "../../layouts/AuthLayout";

const ResetPassword = () => {
  return (
    <AuthLayout
      imageUrl="https://images.unsplash.com/photo-1615842978998-54a9182892b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
      title="Quên mật khẩu? Thật ra là điều tốt."
      description="Đôi khi quên mật khẩu cũng là một việc tốt. Bạn có cơ hội làm mới mật khẩu (thật ra, đổi mật khẩu thường xuyên là một khuyến nghị an toàn) và thoát khỏi tất cả các phiên đăng nhập đã lưu."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
