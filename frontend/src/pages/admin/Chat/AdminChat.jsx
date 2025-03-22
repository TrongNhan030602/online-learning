import { useState, useEffect, useRef } from "react";
import chatApi from "../../../api/chatApi";
import "../../../styles/chat/admin-chat.css";

// Import FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import ChatSidebar from "../../../components/Chat/ChatSidebar";
import ChatBox from "../../../components/Chat/ChatBox";

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(""); // ✅ Lưu tên học viên
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]); // ✅ Lưu danh sách học viên
  const currentUser = { id: 1, name: "Admin", role: "admin" };

  // ✅ Lấy danh sách học viên từ API khi mở sidebar
  const fetchedStudents = useRef(false);

  useEffect(() => {
    if (isSidebarOpen && !fetchedStudents.current) {
      fetchStudents();
      fetchedStudents.current = true;
    }
  }, [isSidebarOpen]);

  const fetchStudents = async () => {
    try {
      const { data } = await chatApi.getStudentsWhoChatted();
      setStudents(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học viên:", error);
    }
  };

  return (
    <div className="admin-chat">
      <button
        className="admin-chat__toggle-sidebar"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faBars} />
      </button>

      {isSidebarOpen && (
        <ChatSidebar
          students={students}
          onSelectStudent={(userId, userName) => {
            setSelectedUser(userId);
            setSelectedUserName(userName);
          }}
          className="admin-chat__sidebar"
        />
      )}

      <div
        className={`admin-chat__container ${
          isSidebarOpen
            ? "admin-chat__container--with-sidebar"
            : "admin-chat__container--full-width"
        }`}
      >
        {selectedUser ? (
          <>
            <div className="admin-chat__header">
              Đang chat với: <strong>{selectedUserName}</strong>
            </div>
            <ChatBox
              selectedUser={selectedUser}
              currentUser={currentUser}
            />
          </>
        ) : (
          <div className="admin-chat__placeholder">Chọn học viên để chat</div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
