import { useEffect, useMemo, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import ScrollToBottom from "react-scroll-to-bottom";
import empty_pfp from "../assets/img/empty-profile-picture-612x612.jpg";
import "../styles/components/post.css";

interface ChatProps {
  socket: any;
  username: string | null;
  room: string;
  room_id: number | undefined;
}

interface MessageProps {
  room_id: number | undefined;
  user_id: number;
  Username: string | null;
  Content: string;
  date_time: string;
  message_reply_id: number | null;
  message_reply_username: string | null;
  firebase_avatar_url?: string;
}

const Chat = ({ socket, username, room, room_id }: ChatProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<MessageProps[]>([]);
  let avatarUrl: string = "";

  // retrieve all messages in room_id from the database
  useEffect(() => {
    const fetchData = async (room_id: number | undefined) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/rooms/${room_id}`
        );

        if (response.ok) {
          const messages_object = await response.json();

          console.log(messages_object);
          setMessageList(messages_object);
        } else {
          console.error(`Error retrieving messages in room id: ${room_id}`);
        }
      } catch (error) {
        console.error("Error during GET request:", error);
      }
    };

    fetchData(room_id);
  }, []);

  const sendMessage = async () => {
    if (currentMessage !== "") {
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
        const messageData: MessageProps = {
          room_id,
          user_id: user_details.user_id,
          Username: username,
          Content: currentMessage,
          date_time: `${month}/${day}/${year} ${hours}:${new Date(
            Date.now()
          ).getMinutes()} ${amPM}`,
          message_reply_id: null,
          message_reply_username: null,
        };

        // console.log("This is messageData ", messageData);
        console.log("This is messageList ", messageList);

        await socket.emit("send_message", messageData);
        // also add your own message to your end
        setMessageList((list) => [...list, messageData]);
        // clear up message after sending it
        setCurrentMessage("");
      } else {
        console.error("Failed to retrieve user_details from localstorage.");
      }
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (messageData: MessageProps) => {
      console.log(messageData);
      // add your message to the receiver's end
      // ...list retrieves the previoues messages.
      setMessageList((list) => [...list, messageData]);
    };

    socket.on("receive_message", receiveMessageHandler);

    return () => {
      // Cleanup the event listener on component unmount
      // This ensures the message is only rendered once.
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h4>{room}</h4>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent: MessageProps, index) => {
            const { Username, Content, date_time, firebase_avatar_url } =
              messageContent;

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
          // adding this allows the program to know that the value of this input is currentMessage, so every time currentMessage is set to empty, the input is also set to empty.
          value={currentMessage}
          placeholder="Hii..."
          onChange={(e) => {
            setCurrentMessage(e.target.value);
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

export default Chat;
