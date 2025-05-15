import { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import chatApi from "@/api/chatApi";
import pusher from "@/utils/pusher";
import "../../styles/chat/chat-box.css";

const ChatBox = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesRef = useRef([]);

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

      messagesRef.current = filteredMessages;
      setMessages(filteredMessages);
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    fetchMessages();
  }, [selectedUser, fetchMessages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      const payload = { message, user_id: selectedUser };
      const { data } = await chatApi.sendMessage(payload);

      setMessages((prev) => [...prev, data.data]);
      setMessage("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    if (!selectedUser) return;
    const chatChannel = pusher.subscribe(`chat.${selectedUser}`);

    const handleNewMessage = (newMessage) => {
      if (newMessage.user_id === selectedUser) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    chatChannel.bind("message", handleNewMessage);

    return () => {
      chatChannel.unbind("message", handleNewMessage);
      chatChannel.unsubscribe();
    };
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-box__input-container">
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
