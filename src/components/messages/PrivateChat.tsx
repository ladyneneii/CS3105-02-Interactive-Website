import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import empty_pfp from "../../assets/img/empty-profile-picture-612x612.jpg";
import "../../styles/components/post.css";

interface PrivateChatComponentProps {
  socket: any;
  username: string;
  private_room_title: string;
  private_room_id: string;
}

interface PrivateMessageProps {
  user_id: number;
  private_room_id: number;
  Content: string;
  date_time: string;
  private_message_reply_id: number | null;
  Username: string;
  private_message_reply_username: string | null;
  firebase_avatar_url?: string;
}

const PrivateChat = ({
  socket,
  username,
  private_room_title,
  private_room_id,
}: PrivateChatComponentProps) => {
  const [currentPrivateMessage, setCurrentPrivateMessage] = useState("");
  const [privateMessageList, setPrivateMessageList] = useState<
    PrivateMessageProps[]
  >([]);

  // retrieve all private_messages in private_room_id from the database
  useEffect(() => {
    const fetchData = async (private_room_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/private_messages/${private_room_id}`
        );

        if (response.ok) {
          const private_messages_object = await response.json();

        //   console.log(private_messages_object);
          setPrivateMessageList(private_messages_object);
        } else {
          console.error(
            `Error retrieving messages in private room id: ${private_room_id}`
          );
        }
      } catch (error) {
        console.error("Error during GET request:", error);
      }
    };

    fetchData(parseInt(private_room_id, 10));
  }, []);

  const sendMessage = async () => {
    if (currentPrivateMessage !== "") {
      const unparsed_user_details = localStorage.getItem("user_details");

      if (unparsed_user_details) {
        const user_details = JSON.parse(unparsed_user_details);
        const currentTime = new Date();
        let hours = currentTime.getHours();
        const amPM = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const month = currentTime.getMonth() + 1;
        const day = currentTime.getDate();
        const year = currentTime.getFullYear();
        const privateMessageData: PrivateMessageProps = {
          private_room_id: parseInt(private_room_id, 10),
          user_id: user_details.user_id,
          Username: username,
          Content: currentPrivateMessage,
          date_time: `${month}/${day}/${year} ${hours}:${new Date(
            Date.now()
          ).getMinutes()} ${amPM}`,
          private_message_reply_id: null,
          private_message_reply_username: null,
        };

        // console.log("This is privateMessageList ", privateMessageList);

        await socket.emit("send_private_message", privateMessageData);
        // also add your own message to your end
        setPrivateMessageList((list) => [...list, privateMessageData]);
        // clear up message after sending it
        setCurrentPrivateMessage("");
      } else {
        console.error("Failed to retrieve user_details from localstorage.");
      }
    }
  };

  useEffect(() => {
    const receivePrivateMessageHandler = (privateMessageData: PrivateMessageProps) => {
    //   console.log(privateMessageData);
      // add your message to the receiver's end
      // ...list retrieves the previoues messages.
      setPrivateMessageList((list) => [...list, privateMessageData]);
    };

    socket.on("receive_private_message", receivePrivateMessageHandler);

    return () => {
      // Cleanup the event listener on component unmount
      // This ensures the message is only rendered once.
      socket.off("receive_private_message", receivePrivateMessageHandler);
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h4>{private_room_title}</h4>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {privateMessageList.map((privateMessageContent: PrivateMessageProps, index) => {
            const { Username, Content, date_time, firebase_avatar_url } =
              privateMessageContent;

            return (
              <div
                className="message"
                id={username === Username ? "you" : "other"}
                key={index}
              >
                {username !== Username && (
                  <img
                    src={
                      firebase_avatar_url === "n/a"
                        ? empty_pfp
                        : firebase_avatar_url
                    }
                    alt="profile picture"
                    className="rounded-circle empty_profile_picture_icon me-3"
                  />
                )}
                <div className="very-flex-end">
                  <div className="message-content">
                    <p>{Content}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{date_time}</p>
                    <p id="author">{Username}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          // adding this allows the program to know that the value of this input is currentPrivateMessage, so every time currentPrivateMessage is set to empty, the input is also set to empty.
          value={currentPrivateMessage}
          placeholder="Hii..."
          onChange={(e) => {
            setCurrentPrivateMessage(e.target.value);
          }}
          // Allow sending of message by simply pressing Enter
          onKeyDown={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button className="btn btn-primary me-2" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default PrivateChat;
