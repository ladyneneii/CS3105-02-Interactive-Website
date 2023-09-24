import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import MainPage from "./pages/MainPage";
import Comment from "./comments/Comments";


const App = () => {
  return (
    <main className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/MainPage" element={<MainPage />} />
          <Route path="/Comment" element={<Comment commentsUrl="placeholder" currentUserId="1" />}
/>
        </Routes>
      </Router>
    </main>
  );
};

export default App;
