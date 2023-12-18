import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import Chat from "../components/messages/Chat";
import PrivateChat from "../components/messages/PrivateChat";
import "../styles/pages/style.css";
import Button from "../components/Button";
import { PrivateRoomComponentProps } from "../components/messages/PrivateRoomsList";
import PrivateRoomsList from "../components/messages/PrivateRoomsList";

const socket = io("http://localhost:3001");

interface RoomProps {
  Members: string;
  Password: string;
  State: "Active" | "Blocked" | "Archived" | "Pending";
  Title: String;
  room_id: number;
}

const MessagesPage = () => {
  const [privateRooms, setPrivateRooms] = useState<PrivateRoomComponentProps[]>(
    []
  );
  const roomRef = useRef<HTMLInputElement | null>(null);
  const [room, setRoom] = useState("");
  const [pwd, setPwd] = useState("");
  const [validRoom, setValidRoom] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showPrivateChat, setShowPrivateChat] = useState(false);
  const [dummyKey, setDummyKey] = useState(0);
  const [roomObject, setRoomObject] = useState<RoomProps | undefined>();
  const unparsed_user_details = localStorage.getItem("user_details");

  const [privateRoomId, setPrivateRoomId] = useState("");
  const [privateRoomTitle, setPrivateRoomTitle] = useState("");

  let logged_in_user_id = "";

  useEffect(() => {
    const user_details_str = localStorage.getItem("user_details");
    if (user_details_str) {
      logged_in_user_id = JSON.parse(user_details_str).user_id;
    } else {
      console.error("user details not found in the local storage.");
    }

    const fetchPrivateRooms = async (logged_in_user_id: string) => {
      // console.log("This is logged in user Id: " + logged_in_user_id);
      try {
        const response = await fetch(
          `http://localhost:3001/api/private_rooms/${logged_in_user_id}`
        );

        if (response.ok) {
          const private_rooms_object = await response.json();

          // console.log(private_rooms_object);
          setPrivateRooms(private_rooms_object);
        } else {
          console.error("Error retrieving private rooms.");
        }
      } catch (error) {
        console.error("Error during GET request:", error);
      }
    };

    fetchPrivateRooms(logged_in_user_id);
  }, []);

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRoom = e.target.value;
    setValidRoom(newRoom.length === 0 ? false : true);
    setRoom(newRoom);
  };

  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPwd = e.target.value;
    setValidPwd(newPwd.length === 0 ? false : true);
    setPwd(newPwd);
  };

  useEffect(() => {
    if (roomObject) {
      setShowChat(true);
    } else {
      if (roomRef.current) {
        roomRef.current.focus();
      }
      console.error("Failed to retrieve room_object json.");
    }
  }, [roomObject]);

  useEffect(() => {
    setShowPrivateChat(true);
  }, [privateRoomId, dummyKey]);

  console.log(privateRoomId);
  console.log(showPrivateChat);

  let username = "";
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

        if (response.ok) {
          const [room_object] = await response.json();
          // console.log(room_object);
          // console.log("This is room_id: ", room_object.room_id);

          socket.emit("join_room", room_object.room_id);
          setRoomObject(room_object);
          setShowPrivateChat(false);
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
      console.log("Please fill in the form.");
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="container-xxl mt-4">
        <div className="row">
          <div className="col">
            <div className="messages__div border rounded-5 p-4 mb-4">
              <div className="row">
                <h3 className="mb-3">Join a chatroom</h3>
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

            <div className="messages__div private_chats_list_container border rounded-5 p-4 overflow-auto">
              <h3 className="mb-3">Your Private Chats</h3>
              <PrivateRoomsList
                privateRooms={privateRooms}
                setShowChat={setShowChat}
                setShowPrivateChat={setShowPrivateChat}
                setPrivateRoomId={setPrivateRoomId}
                setPrivateRoomTitle={setPrivateRoomTitle}
                setDummyKey={setDummyKey}
              />
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
            {showPrivateChat && (
              <PrivateChat
                socket={socket}
                username={username}
                private_room_id={privateRoomId}
                private_room_title={privateRoomTitle}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesPage;
