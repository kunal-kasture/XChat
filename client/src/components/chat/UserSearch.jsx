import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";

const UserSearch = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { api, user: currentUser } = useAuth();
  const { initRoom } = useChat();

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        setLoading(true);
        try {
          const response = await api.get(
            `/users/search?searchTerm=${encodeURIComponent(searchTerm.trim())}`
          );
          if (response.data && response.data.success) {
            setResults(response.data.data);
          }
        } catch (err) {
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, api]);

  if (!isOpen) return null;

  const handleSelectUser = async (selectedUserId) => {
    try {
      await initRoom(selectedUserId);
      onClose();
    } catch (err) {
      console.error("Failed to init room:", err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="search-modal" id="user-search-modal">
        <div className="search-modal-header">
          <h3>Find People to Chat</h3>
          <button id="close-search" className="close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="search-modal-body">
          <div className="search-input-wrapper">
            <i className="bi bi-search"></i>
            <input
              id="search-input"
              type="text"
              placeholder="Search by name, username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="search-results" id="search-results-list">
            {loading && <div className="search-loading">Searching...</div>}

            {!loading && searchTerm && results.length === 0 && (
              <div className="search-empty">No users found</div>
            )}

            {!loading &&
              results.map((u) => {
                const initials = (u.fullName || u.username || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={u._id}
                    id={`user-result-${u._id}`}
                    className="user-result-item"
                    onClick={() => handleSelectUser(u._id)}
                  >
                    <div className="user-avatar-circle">{initials}</div>
                    <div className="user-result-info">
                      <div className="user-result-name">{u.fullName}</div>
                      <div className="user-result-username">@{u.username}</div>
                      <div className="user-result-email">{u.email}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
