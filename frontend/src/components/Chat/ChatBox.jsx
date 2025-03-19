import { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import chatApi from "../../api/chatApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import pusher from "../../utils/pusher"; // ✅ Import Pusher
import "../../styles/chat/chat-box.css";

const ChatBox = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null); // Dùng để tham chiếu đến tin nhắn cuối cùng

  // ✅ Lấy tin nhắn khi chọn user
  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return;
    try {
      const { data } = await chatApi.getMessages();
      setMessages(
        data.filter(
          (msg) =>
            msg.user_id === selectedUser || msg.recipient_id === selectedUser
        )
      );
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ✅ Gửi tin nhắn
  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      const payload = { message, user_id: selectedUser };
      const { data } = await chatApi.sendMessage(payload);
      setMessages([...messages, data.data]); // ✅ Hiển thị ngay tin nhắn gửi đi
      setMessage("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  // ✅ Nhấn Enter để gửi
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // ✅ Lắng nghe tin nhắn mới từ Pusher
  useEffect(() => {
    if (!selectedUser) return;

    const channel = pusher.subscribe(`chat.${selectedUser}`);

    channel.bind("message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [selectedUser]);

  // ✅ Cuộn xuống tin nhắn cuối cùng mỗi khi messages thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-box">
      <div className="chat-box__messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-box__message ${
              msg.user_id === currentUser.id ? "sent" : "received"
            }`}
          >
            <div className="chat-box__content">{msg.message}</div>
          </div>
        ))}
        {/* Đặt phần tử này ở cuối danh sách tin nhắn để cuộn đến */}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-box__input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={handleSend}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

ChatBox.propTypes = {
  selectedUser: PropTypes.number.isRequired,
  selectedUserName: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatBox;
