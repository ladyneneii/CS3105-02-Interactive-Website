import { useState, useRef, useEffect } from "react";
import Card from "../components/Card";

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(true);
  //   }, 2000);
  // }, []);

  return (
    <>
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
