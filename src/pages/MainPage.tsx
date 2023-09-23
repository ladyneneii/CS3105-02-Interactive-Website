import { useState, useRef, useEffect } from "react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Navbar></Navbar>

      <div className="container text-center">
        <div className="row">
          {[...Array(12)].map((_, index) => (
            <div className="col" key={index}>
              <Card load={2000} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainPage;
