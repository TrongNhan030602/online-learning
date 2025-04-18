import "../../styles/student/student-chat.css";

const StudentChat = () => {
  return (
    <div className="student-chat">
      <h1 className="student-chat__title">Trò chuyện</h1>
      <div className="chat-window">
        <div className="chat-messages">
          {/* Các tin nhắn, có thể thêm các class khác như `message__self` cho tin nhắn của người dùng */}
          <div className="message">Chào bạn, cần giúp đỡ gì không?</div>
          <div className="message message__self">
            Chào, tôi cần giúp đỡ về bài tập.
          </div>
        </div>
        <textarea placeholder="Nhập tin nhắn..."></textarea>
        <button>Gửi</button>
      </div>
    </div>
  );
};

export default StudentChat;
