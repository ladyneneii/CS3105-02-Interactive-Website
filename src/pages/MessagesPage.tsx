import React from "react";
import Sidebar from "../components/messages/Sidebar";
import Chat from "../components/messages/Chat";
import "../styles/scss/messages.scss"

const MessagesPage = () => {
  return (
    <div className="home">
      <div className="container">
        <Sidebar></Sidebar>
        <Chat></Chat>
      </div>
    </div>
  );
};

export default MessagesPage;
