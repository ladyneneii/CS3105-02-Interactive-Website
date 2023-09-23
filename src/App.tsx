import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import MainPage from "./pages/MainPage";

const App = () => {
  return (
    <main className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/MainPage" element={<MainPage />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
