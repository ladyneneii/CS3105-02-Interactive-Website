import React, { useEffect, useRef, useState } from "react";
import empty_pfp from "../../assets/img/empty-profile-picture-612x612.jpg";
import "../../styles/components/post.css";
import Button from "../Button";
import { getAllPosts } from "../../pages/PostsPage";
import { PostProps } from "../../pages/PostsPage";
import Post from "./Post";
import { replies } from "../../pages/PostsPage";
import { storeReplies } from "../../pages/PostsPage";

interface DisplayedPostComponentProps {
  key: string;
  post_id: string;
  user_id: string;
  Username: string;
  PostContent: string;
  date_time: string;
  State: string;
  post_reply_id: string;
  post_reply_level: number;
  Type: string;
  Privacy: string;
  Remark: string;
  post_edit_id: string;
  isEdited: number;
  setAllPosts: React.Dispatch<React.SetStateAction<PostProps[]>>;
  currentPostReplies: PostProps[];
}

const DisplayedPost = ({
  post_id,
  user_id,
  Username,
  PostContent,
  date_time,
  State,
  post_reply_id,
  post_reply_level,
  Type,
  Privacy,
  Remark,
  post_edit_id,
  isEdited,
  setAllPosts,
  currentPostReplies,
}: DisplayedPostComponentProps) => {
  const user_details_str = localStorage.getItem("user_details");
  let logged_in_user_id = "-1";
  let logged_in_username = "";

  if (user_details_str) {
    logged_in_user_id = JSON.parse(user_details_str).user_id;
    logged_in_username = JSON.parse(user_details_str).Username;
  } else {
    console.error("user details not found in the local storage.");
  }

  const dateObject = new Date(date_time);
  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = dateObject.toLocaleDateString(undefined, optionsDate);

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedTime = dateObject.toLocaleTimeString(undefined, optionsTime);

  const postRef = useRef<HTMLTextAreaElement | null>(null);
  const [showPostContent, setShowPostContent] = useState(
    Type === "Normal" ? true : false
  );
  const [postContent, setPostContent] = useState(PostContent);
  const [dummyState, setDummyState] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState(PostContent);
  const [validEditedPostContent, setValidEditedPostContent] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [validReply, setValidReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const post_reply_level_current = post_reply_level;

  const [validRemark, setValidRemark] = useState(false);
  const [showRemark, setShowRemark] = useState(false);
  const [remarkContent, setRemarkContent] = useState(Remark);
  const remarkRef = useRef<HTMLInputElement | null>(null);
  const privacyRef = useRef<HTMLSelectElement | null>(null);

  const displayedPrivacyRef = useRef<HTMLSelectElement | null>(null);
  const [validDisplayedRemark, setValidDisplayedRemark] = useState(false);
  const [showDisplayedRemark, setShowDisplayedRemark] = useState(false);
  const displayedRemarkRef = useRef<HTMLInputElement | null>(null);

  const readTriggeringPost = () => {
    setShowPostContent(true);
  };

  const hidePostContent = () => {
    setShowPostContent(false);
  };

  const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRemarkContent = e.target.value;
    setValidRemark(newRemarkContent.length === 0 ? false : true);
  };

  const handleEditPostPending = () => {
    setIsEditing(true);
    setShowPostContent(true);
    if (Type === "Triggering") {
      setShowDisplayedRemark(true);
      setValidEditedPostContent(postRef.current?.value !== "" ? true : false);
    }
    // Set focus and move cursor to the end of the text
    postRef.current?.focus();
    postRef.current?.setSelectionRange(
      editedPostContent.length,
      editedPostContent.length
    );
  };

  const handlePostEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newEditedPostContent = e.target.value;
    setEditedPostContent(newEditedPostContent);
    setValidEditedPostContent(newEditedPostContent !== "" ? true : false);
    console.log(displayedRemarkRef.current);
  };

  const handleDisplayedTriggering = () => {
    setValidEditedPostContent(postRef.current?.value !== "" ? true : false);
    setShowDisplayedRemark(true);
    displayedRemarkRef.current?.focus();
  };

  useEffect(() => {
    if (showDisplayedRemark && displayedRemarkRef.current) {
      displayedRemarkRef.current.focus();
    }
    setDummyState((prev) => !prev);
    // console.log(displayedRemarkRef.current);
  }, [showDisplayedRemark]);

  const handleDisplayedTriggeringCancel = () => {
    // empty the value in remark input
    if (displayedRemarkRef.current) {
      displayedRemarkRef.current.value = "";
      setRemarkContent("");
    }
    setShowDisplayedRemark(false);
    postRef.current?.focus();
  };

  const handleDisplayedRemarkChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRemarkContent = e.target.value;
    setValidDisplayedRemark(newRemarkContent.length === 0 ? false : true);
    setRemarkContent(newRemarkContent);
  };

  const handleEditPostCancel = () => {
    setValidEditedPostContent(false);
    // only set showPostContent to false upon edit cancel if the post is triggering; otherwise, let it remain true.
    if (!showPostContent) {
      setShowPostContent(false);
    }
    setShowDisplayedRemark(false);
    setIsEditing(false);
    // preserve the postContent value
    if (postRef.current) {
      postRef.current.value = postContent;
    }
    setEditedPostContent(postContent);
  };

  const handleEditPostConfirm = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // preserve the editedContent value
    if (postRef.current) {
      postRef.current.value = editedPostContent;
    }

    const formData = new FormData();
    formData.append("post_id", post_id);
    formData.append("Content", editedPostContent);
    formData.append("date_time", new Date().toISOString());
    formData.append("Type", showDisplayedRemark ? "Triggering" : "Normal");
    formData.append(
      "Privacy",
      displayedPrivacyRef.current ? displayedPrivacyRef.current.value : "n/a"
    );
    formData.append("Remark", showDisplayedRemark ? remarkContent : "");

    // update post content on the database
    try {
      const response = await fetch("http://localhost:3001/api/posts", {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        console.log("Successfully updated post on the database.");
        getAllPosts().then((posts_json) => setAllPosts(posts_json));
        setValidEditedPostContent(false);
        setIsEditing(false);
        setPostContent(editedPostContent);
        setShowDisplayedRemark(false);
      } else {
        console.error("Failed to update post on the database");

        return;
      }
    } catch (error) {
      console.error("Error during PATCH request:", error);

      return;
    }
  };

  const handleDeletePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("post_id", post_id);

    if (
      window.confirm(
        "Confirm deletion? If this post does not have replies, the action cannot be undone."
      )
    ) {
      // remove post from the database
      try {
        const response = await fetch("http://localhost:3001/api/posts", {
          method: "DELETE",
          body: formData,
        });

        if (response.ok) {
          console.log("Successfully removed post from the database.");

          // reload all the posts excluding the deleted one
          getAllPosts().then((posts_json) => setAllPosts(posts_json));
        } else {
          console.error("Failed to delete post from the database");

          return;
        }
      } catch (error) {
        console.error("Error during DELETE request:", error);

        return;
      }
    }
  };

  const handleUndoDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3001/api/undo_delete_post/${post_id}`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        console.log("Successfully undid delete.");
        getAllPosts().then((posts_json) => setAllPosts(posts_json));
      } else {
        console.error("Failed to undo delete.");

        return;
      }
    } catch (error) {
      console.error("Error during PATCH request:", error);

      return;
    }
  };

  const handlePostReply = () => {
    setShowReplyForm(true);
    replyRef.current?.focus();
  };

  useEffect(() => {
    if (showReplyForm && replyRef.current) {
      replyRef.current.focus();
    }
  }, [showReplyForm]);

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newReplyContent = e.target.value;
    setReplyContent(newReplyContent);
    setValidReply(newReplyContent.length === 0 ? false : true);
  };

  const handleReplySubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", logged_in_user_id);
    formData.append("Username", logged_in_username);
    formData.append("Content", replyContent);
    formData.append("date_time", new Date().toISOString());
    formData.append("post_reply_id", post_id);
    formData.append("post_reply_level", (post_reply_level + 1).toString());
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
        console.log("Successfully added reply to the database.");

        getAllPosts().then((posts_json) => setAllPosts(posts_json));
        setShowReplyForm(false);
        setShowReplies(true);
        setShowRemark(false);
        setValidReply(false);
      } else {
        console.error("Failed to add reply to the database");

        return;
      }
    } catch (error) {
      console.error("Error during POST request:", error);

      return;
    }
  };

  const handlePostViewReplies = () => {
    setShowReplies(true);
  };

  const handlePostHideReplies = () => {
    setShowReplies(false);
  };

  return (
    <>
      <div
        className="container-md bg-light bg-gradient border rounded-4 shadow mb-3"
        style={{
          marginLeft: post_reply_level > 0 ? "50px" : "0px",
          width: "100%",
        }}
      >
        {State === "Visible" ? (
          <>
            <div className="user_details my-2">
              <img
                src={empty_pfp}
                alt="empty profile picture"
                className="rounded-circle empty_profile_picture_icon"
              />
              <div className="username_date-time">
                <p className="my-0 fw-semibold">{Username}</p>
                <span className="fw-normal">
                  {formattedDate} {formattedTime}
                </span>
              </div>
            </div>
            {Type === "Triggering" && (
              <div className="form-floating mb-3">
                <p className="my-0 text-center fw-semibold text-danger">
                  This post is triggering. Proceed with caution.
                </p>
                <p className="mb-3 text-center fw-semibold text-danger">
                  Trigger warnings: {Remark}
                </p>
                <div className="text-center">
                  {showPostContent ? (
                    <Button
                      color="danger"
                      onClick={hidePostContent}
                      disabled={!isEditing ? false : true}
                    >
                      Hide post
                    </Button>
                  ) : (
                    <Button
                      color="danger"
                      onClick={readTriggeringPost}
                      disabled={false}
                    >
                      Proceed reading
                    </Button>
                  )}
                </div>
              </div>
            )}
            {showPostContent && (
              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  placeholder="What's on your mind?"
                  value={isEditing ? editedPostContent : postContent}
                  ref={postRef}
                  onChange={handlePostEditChange}
                  readOnly={!isEditing}
                ></textarea>
                <label htmlFor="post">What's on your mind?</label>
              </div>
            )}
            {showDisplayedRemark && (
              <div className="mb-3">
                <label className="form-label">Trigger Warnings:</label>
                <input
                  type="text"
                  id="remark"
                  value={remarkContent}
                  ref={displayedRemarkRef}
                  onChange={handleDisplayedRemarkChange}
                  className="form-control"
                  placeholder="e.g. eating disorder, violence, etc."
                  readOnly={isEditing ? false : true}
                />
              </div>
            )}
            {isEditing && (
              <div className="mb-3">
                <label className="form-label">Privacy</label>
                <select
                  className="form-select"
                  id="privacy"
                  ref={displayedPrivacyRef}
                  defaultValue="Everyone"
                  style={{ width: "15%" }}
                >
                  <option value="Everyone">Everyone</option>
                  <option value="MHP">MHP</option>
                  <option value="Followers">Followers</option>
                  <option value="Friends">Friends</option>
                </select>
              </div>
            )}
          </>
        ) : State === "MarkedDeleted" ? (
          <p className="my-3 text-center fw-semibold">Deleted</p>
        ) : State === "MarkedHidden" ? (
          <p className="my-3 text-center fw-semibold">Hidden</p>
        ) : null}
        <div className="post_settings">
          <Button
            color="primary"
            onClick={handlePostReply}
            disabled={isEditing ? true : false}
          >
            Reply
          </Button>
          {currentPostReplies.length > 0 &&
            (!showReplies ? (
              <Button
                color="primary"
                onClick={handlePostViewReplies}
                disabled={isEditing ? true : false}
              >
                View Replies
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={handlePostHideReplies}
                disabled={isEditing ? true : false}
              >
                Hide Replies
              </Button>
            ))}
          {/* If displayed post belongs to logged in user */}
          {parseInt(logged_in_user_id, 10) === parseInt(user_id, 10) && (
            <>
              {State === "MarkedDeleted" ? (
                <Button color="primary" onClick={handleUndoDelete}>
                  Undo Delete
                </Button>
              ) : !isEditing ? (
                <>
                  <Button color="primary" onClick={handleEditPostPending}>
                    Edit
                  </Button>
                  <Button color="danger" onClick={handleDeletePost}>
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    onClick={handleEditPostConfirm}
                    disabled={
                      displayedRemarkRef.current
                        ? !validEditedPostContent || !validDisplayedRemark
                        : !validEditedPostContent
                    }
                  >
                    Confirm Edit
                  </Button>
                  {!showDisplayedRemark ? (
                    <Button
                      color="primary"
                      onClick={handleDisplayedTriggering}
                      disabled={false}
                    >
                      Mark this as triggering
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onClick={handleDisplayedTriggeringCancel}
                      disabled={false}
                    >
                      Unmark as triggering
                    </Button>
                  )}
                  <Button color="danger" onClick={handleEditPostCancel}>
                    Cancel
                  </Button>
                </>
              )}
            </>
          )}
        </div>
        {showReplies &&
          currentPostReplies.map(
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
              },
              index
            ) =>
              storeReplies(
                currentPostReplies,
                index,
                post_reply_level_current + 1
              ) &&
              post_reply_level === post_reply_level_current + 1 && (
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
                ></DisplayedPost>
              )
          )}
      </div>
      {showReplyForm && (
        <Post
          postRef={replyRef}
          onChange={handleReplyChange}
          onChangeRemark={handleRemarkChange}
          color="primary"
          onClick={handleReplySubmit}
          disabled={
            remarkRef.current ? !validReply || !validRemark : !validReply
          }
          replyMode={true}
          setShowReplyForm={setShowReplyForm}
          postReplyLevel={post_reply_level}
          showRemark={showRemark}
          setShowRemark={setShowRemark}
          remarkRef={remarkRef}
          privacyRef={privacyRef}
          setDummyState={setDummyState}
        >
          Confirm Reply
        </Post>
      )}
    </>
  );
};

export default DisplayedPost;
