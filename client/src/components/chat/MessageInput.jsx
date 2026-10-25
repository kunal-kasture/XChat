import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../contexts/ChatContext";

const MessageInput = () => {
  const [content, setContent] = useState("");
  const { sendMessage, setTyping } = useChat();
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setContent(text);

    setTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 1500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendMessage(content);
    setContent("");
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form className="message-input-form" onSubmit={handleSend}>
      <div className="message-input-container">
        <button type="button" className="emoji-btn" title="Emoji">
          <i className="bi bi-emoji-smile"></i>
        </button>

        <input
          id="message-input"
          type="text"
          placeholder="Type your message..."
          value={content}
          onChange={handleInputChange}
          autoComplete="off"
        />

        <button
          id="send-button"
          type="submit"
          className="send-btn"
          disabled={!content.trim()}
          title="Send"
        >
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
