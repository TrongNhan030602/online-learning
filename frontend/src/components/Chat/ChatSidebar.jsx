import PropTypes from "prop-types";
import "../../styles/chat/sidebar.css";
import Loading from "../Common/Loading";
import { useState } from "react";

const ChatSidebar = ({ students, onSelectStudent }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student.user_id);
    onSelectStudent(student.user_id, student.user?.name);
  };

  return (
    <div className="chat-sidebar">
      <h3 className="chat-sidebar__title">Danh sách học viên</h3>
      {students.length === 0 ? (
        <Loading />
      ) : (
        <ul className="chat-sidebar__list">
          {students.map((student) => (
            <li
              key={student.user_id}
              className={`chat-sidebar__item ${
                selectedStudent === student.user_id ? "active" : ""
              }`}
              onClick={() => handleSelectStudent(student)}
            >
              {student.user?.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ChatSidebar.propTypes = {
  students: PropTypes.array.isRequired,
  onSelectStudent: PropTypes.func.isRequired,
};

export default ChatSidebar;
