import { Outlet } from "react-router-dom";
import "../styles/student/student-layout.css";
import StudentHeader from "../components/Student/StudentHeader";
import StudentFooter from "../components/Student/StudentFooter";

const StudentLayout = () => {
  return (
    <div className="student">
      <StudentHeader />
      <main className="student__main">
        <Outlet />
      </main>
      <StudentFooter />
    </div>
  );
};

export default StudentLayout;
