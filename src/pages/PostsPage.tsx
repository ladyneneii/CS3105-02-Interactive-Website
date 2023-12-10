import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/posts/Post";
import Button from "../components/Button";
import DisplayedPost from "../components/posts/DisplayedPost";

export interface PostProps {
  post_id: string;
  user_id: string;
  Username: string;
  Content: string;
  date_time: string;
  State: string;
  post_reply_id: string;
  post_reply_level: number;
}

export const getAllPosts = async () => {
  // get all posts from the database
  try {
    const response = await fetch("http://localhost:3001/api/posts");

    if (response.ok) {
      const posts_json = await response.json();
      console.log(posts_json);

      return posts_json;
    } else {
      console.error("Failed to retrieve all posts");
    }
  } catch (error) {
    console.error("Error during GET request:", error);
  }
};

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

          getAllPosts().then((posts_json) => setAllPosts(posts_json));
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

    getAllPosts().then((posts_json) => setAllPosts(posts_json));
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <section className="container-lg my-5 overflow-x-auto">
        <h1 className="mb-4">Safe Space</h1>

        <Post
          postRef={postRef}
          onChange={handlePostChange}
          color="primary"
          onClick={handlePostSubmit}
          disabled={!validPost}
          replyMode={false}
          postReplyLevel={-1}
        >
          Post
        </Post>

        {allPosts.map(({ post_id, user_id, Username, Content, date_time, State, post_reply_id, post_reply_level }) => (
          <DisplayedPost
            key={post_id}
            post_id={post_id}
            user_id={user_id}
            Username={Username}
            PostContent={Content}
            date_time={date_time}
            State={State}
            post_reply_id={post_reply_id}
            post_reply_level={post_reply_level}
            setAllPosts={setAllPosts}
          ></DisplayedPost>
        ))}
      </section>
    </>
  );
};

export default PostsPage;
