import { useEffect, useMemo, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

interface Props {
  socket: any;
  username: string;
  room: string;
}

interface MessageDataProps {
  room: string;
  author: string;
  message: string;
  time: string;
}

const Chat = ({ socket, username, room }: Props) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<MessageDataProps[]>([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData: MessageDataProps = {
        room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      // also add your own message to your end
      setMessageList((list) => [...list, messageData]);
      // clear up message after sending it
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data: MessageDataProps) => {
      console.log(data);
      // add your message to the receiver's end
      // ...list retrieves the previoues messages.
      setMessageList((list) => [...list, data]);
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
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent: MessageDataProps, index) => {
            const { author, message, time } = messageContent;
            return (
              <div
                className="message"
                id={username === author ? "you" : "other"}
                key={index}
              >
                <div>
                  <div className="message-content">
                    <p>{message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{time}</p>
                    <p id="author">{author}</p>
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
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
