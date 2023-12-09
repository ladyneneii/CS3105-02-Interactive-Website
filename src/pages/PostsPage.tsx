import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/posts/Post";
import Button from "../components/Button";

const PostsPage = () => {
  const postRef = useRef<HTMLTextAreaElement | null>(null);
  const [validPost, setValidPost] = useState(false);
  const [post, setPost] = useState("");

  const handlePost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPost = e.target.value;
    setPost(newPost);
    setValidPost(newPost.length === 0 ? false : true);
  };

  const handlePostSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const user_details_str = localStorage.getItem("user_details");

    if (user_details_str) {
      const user_id = JSON.parse(user_details_str).user_id;
      const Username = JSON.parse(user_details_str).Username;
      const formData = new FormData();

      formData.append("user_id", user_id);
      formData.append("Username", Username);
      formData.append("Content", post);
      formData.append("date_time", new Date().toISOString());

      try {
        const response = await fetch("http://localhost:3001/api/posts", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Successfully added post to the database.");
        } else {
          console.error("Failed to add post to the database");

          return;
        }
      } catch (error) {
        console.error("Error during POST request:", error);

        return;
      }
    } else {
      console.log("user_details not found in local storage.");
    }
  };

  useEffect(() => {
    postRef.current?.focus();

    const getAllPosts = async () => {
      // get all posts from the database
      try {
        const response = await fetch("http://localhost:3001/api/posts");

        if (response.ok) {
          const posts_json = await response.json();
          console.log(posts_json);

          // posts_json.forEach((location: LocationProps) => {
          //   const { Latitude, Longitude } = location;

          //   if (mapRef.current) {
          //     const otherMarker = L.marker([0, 0]).addTo(mapRef.current); // Use the ref

          //     otherMarker.setLatLng([Latitude, Longitude]);
          //   }
          // });
        } else {
          console.error("Failed to retrieve all posts");
        }
      } catch (error) {
        console.error("Error during GET request:", error);
      }
    };

    getAllPosts();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <section className="container-lg my-5">
        <h1 className="mb-4">Help Corner</h1>

        <Post onChange={handlePost} color="primary" onClick={handlePostSubmit} disabled={!validPost}>Post</Post>
        
      </section>
    </>
  );
};

export default PostsPage;
