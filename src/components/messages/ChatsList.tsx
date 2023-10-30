import React from 'react'
import jiafei from "../../assets/img/jiafei-498x486.webp";

const ChatsList = () => {
  return (
    <div className="chatsList">
      <div className="userChat">
        <img className="img" src={jiafei} alt="" />
        <div className="userChatInfo">
          <span>Jane</span>
          <p>Hello</p>
        </div>
      </div>

      <div className="userChat">
        <img className="img" src={jiafei} alt="" />
        <div className="userChatInfo">
          <span>Jane</span>
          <p>Hello</p>
        </div>
      </div>
      
      <div className="userChat">
        <img className="img" src={jiafei} alt="" />
        <div className="userChatInfo">
          <span>Jane</span>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
}

export default ChatsList