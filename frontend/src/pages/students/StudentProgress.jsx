import "../../styles/student/student-progress.css";

const StudentProgress = () => {
  return (
    <div className="student-progress">
      <h1 className="student-progress__title">Tiến độ học tập</h1>
      <div className="progress-bar">
        <div
          className="progress-bar__filled"
          style={{ width: "70%" }}
        ></div>
      </div>
      <p className="student-progress__percentage">70% hoàn thành khóa học.</p>
      <p className="student-progress__message">
        Chúc mừng bạn! Tiếp tục cố gắng để hoàn thành!
      </p>
    </div>
  );
};

export default StudentProgress;
