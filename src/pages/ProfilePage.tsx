import React from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useParams<{ user: string }>();

  return <>
  <Navbar></Navbar>
  <p>{user}</p>
  </>;
};

export default ProfilePage;
