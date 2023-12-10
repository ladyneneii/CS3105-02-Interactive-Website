import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/posts/Post";
import Button from "../components/Button";
import DisplayedPost from "../components/posts/DisplayedPost";

interface PostProps {
  post_id: string;
  user_id: string;
  Username: string;
  Content: string;
  date_time: string;
}

const PostsPage = () => {
  const postRef = useRef<HTMLTextAreaElement | null>(null);
  const [validPost, setValidPost] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [allPosts, setAllPosts] = useState<PostProps[]>([]);

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPostContent = e.target.value;
    setPostContent(newPostContent);
    setValidPost(newPostContent.length === 0 ? false : true);
  };

  const getAllPosts = async () => {
    // get all posts from the database
    try {
      const response = await fetch("http://localhost:3001/api/posts");

      if (response.ok) {
        const posts_json = await response.json();
        console.log(posts_json);
        setAllPosts(posts_json);
      } else {
        console.error("Failed to retrieve all posts");
      }
    } catch (error) {
      console.error("Error during GET request:", error);
    }
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
      formData.append("Content", postContent);
      formData.append("date_time", new Date().toISOString());

      try {
        const response = await fetch("http://localhost:3001/api/posts", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Successfully added post to the database.");

          getAllPosts();
          // empty the value in textarea
          if (postRef.current) {
            postRef.current.value = "";
            postRef.current?.focus();
          }
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

    getAllPosts();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <section className="container-lg my-5">
        <h1 className="mb-4">Help Corner</h1>

        <Post
          postRef={postRef}
          onChange={handlePostChange}
          color="primary"
          onClick={handlePostSubmit}
          disabled={!validPost}
        >
          Post
        </Post>

        {allPosts.map(({ post_id, Username, Content, date_time }) => (
          <DisplayedPost
            key={post_id}
            post_id={post_id}
            Username={Username}
            PostContent={Content}
            date_time={date_time}
          ></DisplayedPost>
        ))}
      </section>
    </>
  );
};

export default PostsPage;
