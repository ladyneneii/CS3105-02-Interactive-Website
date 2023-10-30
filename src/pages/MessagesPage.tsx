import React from "react";
import Sidebar from "../components/messages/Sidebar";
import "../styles/scss/messages.scss"
import Chat from "../components/messages/Chat";

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
