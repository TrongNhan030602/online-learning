import { Outlet, useNavigate } from "react-router-dom";
import LandingHeader from "@/components/Landing/LandingHeader";
import CallToAction from "@/components/Landing/CallToAction";

const LandingLayout = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <div className="layout">
      {/* Header sẽ xuất hiện trên tất cả các trang */}
      <LandingHeader />

      {/* Nội dung trang con sẽ được render tại đây */}
      <main>
        <Outlet />
      </main>

      {/* CallToAction  cũng sẽ xuất hiện trên tất cả các trang */}
      <CallToAction onLoginClick={handleLoginClick} />
    </div>
  );
};

export default LandingLayout;
