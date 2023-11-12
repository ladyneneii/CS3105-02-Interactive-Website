import { useState } from "react";
import io from "socket.io-client";
import Chat from "../components/Chat";
import "../styles/pages/style.css";

const socket = io("http://localhost:3001");

const MessagesPage = () => {
  // const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [pwd, setPwd] = useState("");
  const [showChat, setShowChat] = useState(false);
  const username = localStorage.getItem("username") || "";

  const joinRoom = async () => {
    if (username !== "" && room !== "" && pwd !== "") {
      // add data to database
      try {
        const formData = new FormData();

        formData.append("Title", room);
        formData.append("Password", pwd);
        formData.append("Members", username);
        formData.append("State", "Active");

        const response = await fetch("http://localhost:3001/api/rooms", {
          method: "PUT",
          body: formData,
        });

        console.log(username, room, pwd);
        console.log(formData.get("Title"));
        console.log(formData.get("Password"));
        console.log(formData.get("Members"));
        console.log(formData.get("State"));

        if (response.ok) {
          console.log("Room added successfully!");

          socket.emit("join_room", room);
          setShowChat(true);
        } else {
          console.error("Failed to add room to the database");
          console.log(response);

          return;
        }
      } catch (error) {
        console.error("Error during PUT request:", error);

        return;
      }
    }
  };

  return (
    <div className="MessagesPage">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join a chat</h3>
          <input
            type="text"
            placeholder="Room Title..."
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => {
              setPwd(e.target.value);
            }}
          />
          <button onClick={joinRoom}>Join a room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
};

export default MessagesPage;
