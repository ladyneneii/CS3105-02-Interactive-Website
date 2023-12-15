import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import MHPFormPage from "./pages/MHPFormPage";
import MainPage from "./pages/MainPage";
import PostsPage from "./pages/PostsPage";
import MessagesPage from "./pages/MessagesPage";
import TheWorldPage from "./pages/TheWorldPage";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const App = () => {
  return (
    <main className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/MHPFormPage" element={<MHPFormPage />} />
          <Route path="/MainPage" element={<MainPage />} />
          <Route path="/PostsPage" element={<PostsPage />} />
          <Route path="/MessagesPage" element={<MessagesPage />} />
          <Route path="/TheWorldPage" element={<TheWorldPage />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
