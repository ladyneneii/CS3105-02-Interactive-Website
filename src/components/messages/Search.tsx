import React from "react";
import jiafei from "../../assets/img/jiafei-498x486.webp"

const Search = () => {
  return (
    <div className="search">
      <div className="searchForm">
        <input className="input" type="text" placeholder="Find a user..." />
      </div>
      <div className="userChat">
        <img className="img" src={jiafei} alt="" />
        <div className="userChatInfo">
          <span>Jane</span>
        </div>
      </div>
    </div>
  );
};

export default Search;
