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
  Type: string;
  Privacy: string;
  Remark: string;
  post_edit_id: string;
  isEdited: number;
  firebase_avatar_url: string;
}

export const getAllPosts = async () => {
  // get all posts from the database
  try {
    const response = await fetch("http://localhost:3001/api/posts");

    if (response.ok) {
      const posts_json = await response.json();

      return posts_json;
    } else {
      console.error("Failed to retrieve all posts");
    }
  } catch (error) {
    console.error("Error during GET request:", error);
  }
};

export let replies: PostProps[] = [];

export const storeReplies = (
  allPosts: PostProps[],
  index: number,
  rootPostReplyLevel: number
) => {
  // reset replies array
  replies = [];
  for (
    let i = index + 1;
    i < allPosts.length && allPosts[i]["post_reply_level"] > rootPostReplyLevel;
    i++
  ) {
    replies.push(allPosts[i]);
  }
  // console.log(allPosts);

  // console.log(`Replies to post_id ${allPosts[index]["post_id"]}: ${replies}`);

  return true;
};

const PostsPage = () => {
  const postRef = useRef<HTMLTextAreaElement | null>(null);
  const [validContent, setValidContent] = useState(false);
  const [validRemark, setValidRemark] = useState(false);
  const [dummyState, setDummyState] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [allPosts, setAllPosts] = useState<PostProps[]>([]);
  const [showRemark, setShowRemark] = useState(false);
  const remarkRef = useRef<HTMLInputElement | null>(null);
  const privacyRef = useRef<HTMLSelectElement | null>(null);

  const handlePostContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newPostContent = e.target.value;
    setPostContent(newPostContent);
    setValidContent(newPostContent.length === 0 ? false : true);
  };

  const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRemarkContent = e.target.value;
    setValidRemark(newRemarkContent.length === 0 ? false : true);
    //  console logging may be delayed but the disabledSubmitBtn property of the button will toggle correctly.
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
      // State is Visible by default
      formData.append("post_reply_level", "0");
      formData.append("Type", showRemark ? "Triggering" : "Normal");
      formData.append(
        "Privacy",
        privacyRef.current ? privacyRef.current.value : "n/a"
      );
      formData.append(
        "Remark",
        remarkRef.current ? remarkRef.current.value : ""
      );

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
          setShowRemark(false);
          setValidContent(false);
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
          onChange={handlePostContentChange}
          onChangeRemark={handleRemarkChange}
          color="primary"
          onClick={handlePostSubmit}
          // disabled={disabledSubmitBtn}
          disabled={
            remarkRef.current ? !validContent || !validRemark : !validContent
          }
          replyMode={false}
          postReplyLevel={-1}
          showRemark={showRemark}
          setShowRemark={setShowRemark}
          remarkRef={remarkRef}
          privacyRef={privacyRef}
          setDummyState={setDummyState}
        >
          Post
        </Post>

        {allPosts.map(
          (
            {
              post_id,
              user_id,
              Username,
              Content,
              date_time,
              State,
              post_reply_id,
              post_reply_level,
              Type,
              Privacy,
              Remark,
              post_edit_id,
              isEdited,
              firebase_avatar_url,
            },
            index
          ) =>
            storeReplies(allPosts, index, 0) &&
            post_reply_level === 0 && (
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
                Type={Type}
                Privacy={Privacy}
                Remark={Remark}
                post_edit_id={post_edit_id}
                isEdited={isEdited}
                setAllPosts={setAllPosts}
                currentPostReplies={replies}
                firebaseAvatarUrl={firebase_avatar_url}
              ></DisplayedPost>
            )
        )}
      </section>
    </>
  );
};

export default PostsPage;
