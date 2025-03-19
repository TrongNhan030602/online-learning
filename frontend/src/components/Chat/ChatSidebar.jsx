import { useEffect, useState } from "react";
import chatApi from "../../api/chatApi";
import "../../styles/chat/sidebar.css";
import Loading from "../Common/Loading";

// eslint-disable-next-line react/prop-types
const ChatSidebar = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await chatApi.getStudentsWhoChatted();
      setStudents(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Lỗi khi lấy danh sách học viên:", error);
    }
  };

  return (
    <div className="chat-sidebar">
      <h3 className="chat-sidebar__title">Danh sách học viên</h3>
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}
      <ul className="chat-sidebar__list">
        {students.map((student) => (
          <li
            key={student.user_id}
            className="chat-sidebar__item"
            onClick={() => onSelectStudent(student.user_id, student.user?.name)}
          >
            {student.user?.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
