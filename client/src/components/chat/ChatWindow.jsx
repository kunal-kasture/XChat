import React, { useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import MessageInput from "./MessageInput";

const ChatWindow = () => {
  const { user } = useAuth();
  const { activeRoom, messages, otherUserTyping } = useChat();
  const messagesEndRef = useRef(null);

  const getOtherUser = () => {
    if (!activeRoom || !activeRoom.users) return null;
    return (
      activeRoom.users.find((u) => u._id !== user?._id) ||
      activeRoom.users[0] ||
      null
    );
  };

  const otherUser = getOtherUser();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherUserTyping]);

  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!activeRoom) {
    return (
      <main className="chat-window-container" id="chat-window">
        <div className="no-chat-selected">
          <div className="no-chat-icon">
            <i className="bi bi-chat-dots"></i>
          </div>
          <h3>No chat selected</h3>
          <p>
            Select a conversation from the sidebar or start a new chat to begin
            messaging
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="chat-window-container" id="chat-window">
      <div className="chat-window-header">
        <div className="chat-header-user">
          <div className="chat-header-avatar">
            {getInitials(otherUser?.fullName || otherUser?.username)}
          </div>
          <div className="chat-header-details">
            <h4>{otherUser?.fullName || otherUser?.username}</h4>
            <div className="chat-header-status">
              {otherUserTyping ? (
                <span id="typing-indicator" className="typing-status">
                  typing...
                </span>
              ) : (
                <span className="last-seen">Online</span>
              )}
            </div>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="icon-btn" title="Options">
            <i className="bi bi-three-dots-vertical"></i>
          </button>
        </div>
      </div>

      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-card">
              <div className="no-messages-icon">
                <i className="bi bi-chat-dots"></i>
              </div>
              <h4>No messages yet</h4>
              <p>Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => {
              const isMe = msg.senderId === user?._id;
              return (
                <div
                  key={msg.id}
                  className={`message-bubble-row ${isMe ? "outgoing" : "incoming"}`}
                >
                  <div
                    className={`message-bubble ${isMe ? "bubble-me" : "bubble-them"}`}
                  >
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageInput />
    </main>
  );
};

export default ChatWindow;
