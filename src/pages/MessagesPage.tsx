import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import "../styles/pages/style.css";
import Button from "../components/Button";

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
  const roomRef = useRef<HTMLInputElement | null>(null);
  const [room, setRoom] = useState("");
  const [pwd, setPwd] = useState("");
  const [validRoom, setValidRoom] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [roomObject, setRoomObject] = useState<RoomProps | undefined>();
  const unparsed_user_details = localStorage.getItem("user_details");

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRoom = e.target.value;
    setValidRoom(newRoom.length === 0 ? false : true);
    setRoom(newRoom)
  };

  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPwd = e.target.value;
    setValidPwd(newPwd.length === 0 ? false : true);
    setPwd(newPwd)
  };

  useEffect(() => {
    if (roomObject) {
      console.log("blasjdfklsd");
      console.log(roomObject.room_id);
      setShowChat(true);
    } else {
      if (roomRef.current) {
        roomRef.current.focus();
      }
      console.error("Failed to retrieve room_object json.");
    }
  }, [roomObject]);

  let username: string | null = null;
  if (unparsed_user_details) {
    username = JSON.parse(unparsed_user_details)?.Username;
  } else {
    console.log("No user_details retrieved.");
  }

  const joinRoom = async () => {
    if (username !== null && room !== "" && pwd !== "") {
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

        // console.log(username, room, pwd);
        // console.log(formData.get("Title"));
        // console.log(formData.get("Password"));
        // console.log(formData.get("Members"));
        // console.log(formData.get("State"));

        if (response.ok) {
          const [room_object] = await response.json();
          console.log(room_object);
          console.log("This is room_id: ", room_object.room_id);

          socket.emit("join_room", room_object.room_id);
          setRoomObject(room_object);
          setShowChat(false);
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
    <>
      <Navbar></Navbar>
      <div className="container-xxl">
        <div className="row">
          <div className="col">
            <div className="row">
              <h3>Join a chatroom</h3>
            </div>

            <div className="row">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Room Title..."
                  ref={roomRef}
                  onChange={handleRoomChange}
                />
              </div>

              <div className="col">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password..."
                  onChange={handlePwdChange}
                />
              </div>

              <div className="col">
                <Button
                  color="primary"
                  onClick={joinRoom}
                  disabled={!validRoom || !validPwd}
                >
                  Join
                </Button>
              </div>
            </div>
          </div>

          <div className="col">
            {showChat && (
              <Chat
                socket={socket}
                username={username}
                room={room}
                room_id={roomObject?.room_id}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesPage;
