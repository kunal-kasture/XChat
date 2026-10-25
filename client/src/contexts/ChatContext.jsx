import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, set, onValue, off } from "firebase/database";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user, api } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const fetchRooms = async () => {
    if (!user) return;
    try {
      const response = await api.get("/rooms/userrooms");
      if (response.data && response.data.success) {
        setRooms(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    } else {
      setRooms([]);
      setActiveRoom(null);
      setMessages([]);
    }
  }, [user]);

  useEffect(() => {
    if (!activeRoom || !activeRoom._id) {
      setMessages([]);
      return;
    }

    const messagesRef = ref(db, `messages/${activeRoom._id}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        messageList.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });

    const typingRef = ref(db, `typing/${activeRoom._id}`);
    const unsubscribeTyping = onValue(typingRef, (snapshot) => {
      const data = snapshot.val();
      if (data && user) {
        const isSomeoneElseTyping = Object.keys(data).some(
          (userId) => userId !== user._id && data[userId] === true,
        );
        setOtherUserTyping(isSomeoneElseTyping);
      } else {
        setOtherUserTyping(false);
      }
    });

    return () => {
      off(messagesRef);
      off(typingRef);
    };
  }, [activeRoom, user]);

  const sendMessage = async (content) => {
    if (!activeRoom || !user || !content.trim()) return;

    const messagesRef = ref(db, `messages/${activeRoom._id}`);
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, {
      content: content.trim(),
      senderId: user._id,
      timestamp: Date.now(),
    });

    setTyping(false);
  };

  const setTyping = async (isTyping) => {
    if (!activeRoom || !user) return;
    try {
      const userTypingRef = ref(db, `typing/${activeRoom._id}/${user._id}`);
      await set(userTypingRef, isTyping);
    } catch (err) {
      console.error("Error setting typing status:", err);
    }
  };

  const initRoom = async (otherUserId) => {
    try {
      const response = await api.post("/rooms/init", {
        otheruser: otherUserId,
      });
      if (response.data && response.data.success) {
        const roomData = response.data.data;
        await fetchRooms();
        setActiveRoom(roomData);
        return roomData;
      }
    } catch (err) {
      console.error("Error initializing room:", err);
      throw err;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        rooms,
        activeRoom,
        setActiveRoom,
        messages,
        otherUserTyping,
        sendMessage,
        setTyping,
        initRoom,
        fetchRooms,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
