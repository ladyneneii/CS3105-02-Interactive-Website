import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

const MainPage = () => {
  useEffect(() => {
    const fetchAllMHPs = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/mhps_with_user_info"
        );

        if (response.ok) {
          const mhps_json = await response.json();
          console.log(mhps_json);
        } else {
          console.error("Failed to retrieve all mhps");
        }
      } catch (error) {
        console.error("Error during GET request:", error);
      }
    };

    fetchAllMHPs(); // Call the async function immediately
  }, []);
  return (
    <>
      <Navbar></Navbar>
    </>
  );
};

export default MainPage;
