import React from "react";
import trisha from "../../assets/img/trisha-3328x1872.jpg";
import jiafei from "../../assets/img/jiafei-498x486.webp";

const Message = () => {
  return (
    <div className="message owner">
      <div className="messageInfo">
        <img src={trisha} alt="" />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>hi kween</p>
        <img src={jiafei} alt="" />
      </div>
    </div>
  );
};

export default Message;
