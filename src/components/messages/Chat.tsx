import React from "react";
import Cam from "../../assets/img/cam.png";
import Add from "../../assets/img/add.png";
import More from "../../assets/img/more.png";
import MessagesList from "./MessagesList";
import Input from "./Input";

const Chat = () => {
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>Jane</span>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <MessagesList />
      <Input />
    </div>
  );
};

export default Chat;
