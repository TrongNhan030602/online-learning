import { useState, useEffect } from "react";
import "../../../styles/chat/admin-chat.css";
import Loading from "../../../components/Common/Loading";
// Import FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import ChatSidebar from "../../../components/Chat/ChatSidebar";
import ChatBox from "../../../components/Chat/ChatBox";
import chatApi from "../../../api/chatApi";

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(""); // Tên người đang chat
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // Khởi tạo state cho currentUser

  // Gọi API để lấy thông tin user hiện tại (Admin)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await chatApi.getCurrentUser();
        setCurrentUser(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  if (!currentUser) {
    return (
      <Loading
        text="Đang tải dữ liệu..."
        size="lg"
      />
    );
  }

  return (
    <div className="admin-chat">
      {/* Nút mở/đóng sidebar */}
      <button
        className="toggle-sidebar"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faBars} />
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <ChatSidebar
          onSelectStudent={(userId, userName) => {
            setSelectedUser(userId);
            setSelectedUserName(userName);
          }}
        />
      )}

      {/* Chat Box */}
      <div
        className={`chat-container ${
          isSidebarOpen ? "with-sidebar" : "full-width"
        }`}
      >
        {selectedUser ? (
          <>
            {/* Hiển thị tên người đang chat */}
            <div className="chat-header">
              Đang chat với:{" "}
              <strong>
                {selectedUserName}{" "}
                {currentUser.id === selectedUser ? "(bạn)" : ""}
              </strong>
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
