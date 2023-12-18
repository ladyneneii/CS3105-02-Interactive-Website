import React from "react";
import io from "socket.io-client";
import empty_pfp from "../../assets/img/empty-profile-picture-612x612.jpg";
import "../../styles/components/post.css";
import { title } from "process";

const socket = io("http://localhost:3001");

export interface PrivateRoomComponentProps {
  private_room_id: number;
  State: "Active" | "Blocked" | "Archived" | "Pending";
  Member1: string;
  Member2: string;
  Title: string;
  member1_user_id: number;
  member2_user_id: number;
  avatar_url: string;
}

interface PrivateRoomsListComponentProps {
  privateRooms: PrivateRoomComponentProps[];
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPrivateChat: React.Dispatch<React.SetStateAction<boolean>>;
  setPrivateRoomId: React.Dispatch<React.SetStateAction<string>>;
  setPrivateRoomTitle: React.Dispatch<React.SetStateAction<string>>;
  setDummyKey: React.Dispatch<React.SetStateAction<number>>;
}

const PrivateRoomsList = ({
  privateRooms,
  setShowChat,
  setShowPrivateChat,
  setPrivateRoomId,
  setPrivateRoomTitle,
  setDummyKey
}: PrivateRoomsListComponentProps) => {
  const joinPrivateRoom = (private_room_id: number, Title: string) => {
    socket.emit("join_private_room", private_room_id);
    setPrivateRoomTitle(Title)
    setPrivateRoomId(private_room_id.toString())
    setShowChat(false);
    setShowPrivateChat(false);
    setDummyKey((prev) => prev + 1);
  };

  return (
    <>
      {privateRooms.map(
        ({
          private_room_id,
          State,
          Member1,
          Member2,
          Title,
          member1_user_id,
          member2_user_id,
          avatar_url,
        }) => (
          <div
            key={private_room_id}
            className="border rounded-5 bg-white py-3 my-2 d-flex align-items-center private_chat"
            onClick={() => joinPrivateRoom(private_room_id, Title)}
          >
            <img
              src={avatar_url === "n/a" ? empty_pfp : avatar_url}
              alt="profile picture"
              className="rounded-circle empty_profile_picture_icon mx-3"
            />
            <p className="my-0 fw-bold">{Title}</p>
          </div>
        )
      )}
    </>
  );
};

export default PrivateRoomsList;
