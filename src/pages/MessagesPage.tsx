import { useEffect, useState } from "react";
import io from "socket.io-client";
import Chat from "../components/Chat";
import "../styles/pages/style.css";

const socket = io("http://localhost:3001");

interface RoomProps {
  Members: string;
  Password: string;
  State: "Active" | "Blocked" | "Archived" | "Pending";
  Title: String;
  room_id: number;
}

const MessagesPage = () => {
  // const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [pwd, setPwd] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [roomObject, setRoomObject] = useState<RoomProps | undefined>()
  let username: string | null = null;
  const unparsed_user_details = localStorage.getItem("user_details");

  useEffect(() => {
    if (roomObject) {
      setShowChat(true);
    } else {
      console.error("Failed to retrieve room_object json.");
    }
  }, [roomObject]);

  if (unparsed_user_details) {
    username = JSON.parse(unparsed_user_details)?.Username;
  } else {
    console.log("No user_details retrieved.");
  }

  const joinRoom = async () => {
    if (username !== null && room !== "" && pwd !== "") {
      console.log("helloooo");
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
          const [room_object] = await response.json();
          console.log(room_object);
          console.log("This is room_id: ", room_object.room_id);

          socket.emit("join_room", room_object.room_id);
          setRoomObject(room_object);
        } else {
          console.error(
            "Failed to add room to the database or fetch room from the database."
          );
          console.log(response);

          return;
        }
      } catch (error) {
        console.error("Error during PUT request:", error);

        return;
      }
    } else {
      console.log("ERROR");
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
        <Chat
          socket={socket}
          username={username}
          room={room}
          room_id={roomObject?.room_id}
        />
      )}
    </div>
  );
};

export default MessagesPage;
