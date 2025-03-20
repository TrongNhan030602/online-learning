import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import chatApi from "../../api/chatApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import pusher from "../../utils/pusher";
import "../../styles/chat/chat-box.css";

const ChatBox = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesRef = useRef([]); // ✅ Giữ state tin nhắn tránh re-render

  // ✅ Hàm lấy tin nhắn (Dùng useCallback)
  const fetchMessages = useCallback(async () => {
    if (!selectedUser || !currentUser) return;
    try {
      const { data } = await chatApi.getMessages(selectedUser);

      const filteredMessages = data.filter(
        (msg) =>
          (msg.user_id === currentUser.id &&
            msg.recipient_id === selectedUser) ||
          (msg.user_id === selectedUser && msg.recipient_id === currentUser.id)
      );

      messagesRef.current = filteredMessages; // ✅ Cập nhật ref
      setMessages(filteredMessages);
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }
  }, [selectedUser, currentUser]);

  // ✅ Chỉ gọi API khi đổi user
  useEffect(() => {
    fetchMessages();
  }, [selectedUser, fetchMessages]);

  // ✅ Dùng useMemo() để cache tin nhắn (giảm re-render)
  const memoizedMessages = useMemo(() => messages, [messages]);

  // ✅ Gửi tin nhắn
  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      const payload = { message, user_id: selectedUser };
      const { data } = await chatApi.sendMessage(payload);

      // ✅ Cập nhật state tin nhắn ngay lập tức
      messagesRef.current = [...messagesRef.current, data.data];
      setMessages([...messagesRef.current]);
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

  // ✅ WebSocket: Lắng nghe tin nhắn mới (useMemo() tránh re-subscribe)
  const chatChannel = useMemo(() => {
    if (!selectedUser) return null;
    return pusher.subscribe(`chat.${selectedUser}`);
  }, [selectedUser]);

  useEffect(() => {
    if (!chatChannel) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.user_id === selectedUser) {
        messagesRef.current = [...messagesRef.current, newMessage];
        setMessages([...messagesRef.current]);
      }
    };

    chatChannel.bind("message", handleNewMessage);

    return () => {
      chatChannel.unbind("message", handleNewMessage);
      chatChannel.unbind_all();
      chatChannel.unsubscribe();
    };
  }, [chatChannel, selectedUser]);

  // ✅ Cuộn xuống cuối danh sách tin nhắn khi có tin mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-box">
      <div className="chat-box__messages">
        {memoizedMessages.map((msg, index) => (
          <div
            key={index}
            className={`chat-box__message ${
              msg.user_id === currentUser.id ? "sent" : "received"
            }`}
          >
            <div className="chat-box__content">{msg.message}</div>
          </div>
        ))}
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
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatBox;
