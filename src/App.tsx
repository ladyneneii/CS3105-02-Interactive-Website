import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import MainPage from "./pages/MainPage";
import CommentsPage from "./pages/CommentsPage";
import MessagesPage from "./pages/MessagesPage";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const App = () => {
  return (
    <main className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/MainPage" element={<MainPage />} />
          <Route
            path="/CommentsPage"
            element={
              <CommentsPage commentsUrl="placeholder" currentUserId="1" />
            }
          />
          <Route path="/MessagesPage" element={<MessagesPage />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
