import React from 'react'

export interface PrivateRoomComponentProps {
  private_room_id: number;
  State: "Active" | "Blocked" | "Archived" | "Pending";
  Member1: string;
  Member2: string;
  Title: String;
  member1_user_id: number;
  member2_user_id: number;
}

interface PrivateRoomsListComponentProps {
  privateRooms: PrivateRoomComponentProps[];
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrivateRoomsList = ({privateRooms, setShowChat}: PrivateRoomsListComponentProps) => {
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
        }) => (
          <div key={private_room_id} className="row border border-primary">
            <p>{Title}</p>
          </div>
        )
      )}
    </>
  );
}

export default PrivateRoomsList