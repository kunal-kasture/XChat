import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";

const Sidebar = ({ onOpenSearch }) => {
  const { user, logout } = useAuth();
  const { rooms, activeRoom, setActiveRoom } = useChat();

  const getOtherUser = (room) => {
    if (!room || !room.users) return null;
    return room.users.find((u) => u._id !== user?._id) || room.users[0] || null;
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="chat-sidebar">
      <div className="sidebar-header">
        <div className="user-profile-section">
          <div className="profile-avatar">
            {getUserInitials(user?.fullName)}
            <span className="online-badge"></span>
          </div>
          <div className="profile-info">
            <h4 id="user-name">{user?.fullName || "User"}</h4>
            <span id="user-username">@{user?.username || "username"}</span>
          </div>
        </div>
        <button
          id="logout-button"
          className="logout-btn"
          title="Logout"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>

      <div className="sidebar-actions">
        <button
          id="new-chat-button"
          className="new-chat-btn"
          onClick={onOpenSearch}
        >
          <i className="bi bi-plus-circle"></i>
          <span>New Chat</span>
        </button>
      </div>

      <div className="sidebar-section-title">RECENT CHATS</div>

      <div className="chat-rooms-list" id="chat-rooms-list">
        {rooms.length === 0 ? (
          <div className="empty-rooms">
            <div className="empty-icon">
              <i className="bi bi-chat-square-text"></i>
            </div>
            <p className="empty-title">No conversations yet</p>
            <p className="empty-subtitle">Search for users to start chatting</p>
          </div>
        ) : (
          rooms.map((room) => {
            const otherUser = getOtherUser(room);
            const isSelected = activeRoom?._id === room._id;
            const initials = getUserInitials(
              otherUser?.fullName || otherUser?.username,
            );

            return (
              <button
                key={room._id}
                id={`room-${room._id}`}
                className={`room-item ${isSelected ? "active" : ""}`}
                onClick={() => setActiveRoom(room)}
              >
                <div className="room-avatar">{initials}</div>
                <div className="room-info">
                  <div className="room-name">
                    {otherUser?.fullName || otherUser?.username || "Chat Room"}
                  </div>
                  <div className="room-subtext">
                    @{otherUser?.username || "user"}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
