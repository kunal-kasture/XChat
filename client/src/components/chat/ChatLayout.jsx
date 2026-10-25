import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import UserSearch from "./UserSearch";

const ChatLayout = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="chat-layout" id="chat-layout">
      <Sidebar onOpenSearch={() => setSearchOpen(true)} />
      <ChatWindow />
      <UserSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default ChatLayout;
