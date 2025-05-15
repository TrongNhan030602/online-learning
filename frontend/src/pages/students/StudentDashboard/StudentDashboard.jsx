import Slogan from "@/components/Student/StudentDashboard/Slogan";
import BlogSlider from "@/components/Student/StudentDashboard/BlogSlider";
import RegisteredClasses from "@/components/Student/StudentDashboard/RegisteredClasses";
import NewCourses from "@/components/Student/StudentDashboard/NewCourses";
import BlogList from "@/components/Student/StudentDashboard/BlogList";
// import FaqSection from "@/components/Student/StudentDashboard/FaqSection";

import "../../../styles/student/student-dashboard.css";
const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <section className="student-dashboard__slogan">
        <Slogan />
      </section>

      <section className="student-dashboard__blog-slider">
        <BlogSlider />
      </section>

      <section className="student-dashboard__registered-classes">
        <RegisteredClasses />
      </section>

      <section className="student-dashboard__new-courses">
        <NewCourses />
      </section>

      <section className="student-dashboard__blog-list">
        <BlogList />
      </section>

      <section className="student-dashboard__faq">
        {/* <FaqSection /> */}
      </section>
    </div>
  );
};

export default StudentDashboard;
