import { PrettyChatWindow } from "react-chat-engine-pretty";


const MessagesPage = () => {
  const email = localStorage.getItem("email") || "";
  console.log(email);

  return (
    <div style={{ height: "100vh" }}>
      {email.length > 0 && (
        <PrettyChatWindow
          projectId="b2b2d168-2ece-4a41-9cca-dbadc6d1b0bd"
          username={email}
          secret={email}
          style={{ height: "100%" }}
        />
      )}
    </div>
  );
};

export default MessagesPage;
