import React, { useState, useEffect } from "react";
import "./PostDisplay.css"; // Your CSS file for styling
import {
  useDeletePostMutation,
  useEditPostDataMutation,
  useEditPostMutation,
  useGetAllPostQuery,
} from "../../features/post/post";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useGetAllCommentQuery,
} from "../../features/comment/comment";
import {
  useCreateReplyMutation,
  useDeleteReplyMutation,
  useEditReplyMutation,
  useGetAllReplyQuery,
} from "../../features/reply/reply";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

const PostDisplay = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commentEditId, setCommentEditId] = useState();
  const [editedComment, setEditedComment] = useState("");
  const [replys, setReplys] = useState([]);
  const [localReactions, setLocalReactions] = useState({
    like: 0,
    love: 0,
    laugh: 0,
    angry: 0,
  });

  const [postEditText, setPostEditText] = useState("");

  const [editImage, setEditImage] = useState(null);

  const handleEditTextChange = (e) => {
    setPostEditText(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setEditImage(selectedImage);
  };

  const [editPostData] = useEditPostDataMutation();
  const handleSubmit = (postId, postEditText, editImage) => {
    const formData = new FormData();
    formData.append("content", postEditText);
    if (editImage) {
      formData.append("Image", editImage);
    }
    console.log("formData", formData);

    editPostData({ id: postId, data: formData });
  };

  const [deletePost] = useDeletePostMutation();

  const handleDeletePost = async (id) => {
    console.log("DeletePostId", id);
    const res = await deletePost(id);
  };

  const image = localStorage.getItem("image");
  const name = localStorage.getItem("name");

  console.log("comments", comments);
  const [commentText, setCommentText] = useState("");
  const handleCommentChange = (postId, e) => {
    const updatedCommentText = {
      ...commentText,
      [postId]: e.target.value,
    };
    setCommentText(updatedCommentText);
  };
  const { data, isLoading, isError, error } = useGetAllPostQuery();

  useEffect(() => {
    if (isError) {
      console.error("Error fetching post data:", error);
    } else if (!isLoading) {
      setPosts(data.data);
    }
  }, [data, isLoading, isError, error]);

  // const [editPost] = useEditPostMutation();

  const handleLocalReaction = async (postId, reactionType) => {
    try {
      // Call the mutation to update the post on the server
      // await editPost({ id: postId, data: reactionType });

      // Update local reactions
      setLocalReactions((prevReactions) => ({
        ...prevReactions,
        [reactionType]: prevReactions[reactionType] + 1,
      }));
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  const [createComment] = useCreateCommentMutation();

  const handleCommentSubmit = async (id) => {
    // Handle submitting the comment for the postId
    // You can use a mutation to send the comment to the server
    // Example: sendCommentMutation({ postId, commentText });
    const data = {
      postPostId: id,
      content: commentText[id] || "",
    };
    const comment = await createComment(data);
    // Reset comment input after submission
    setCommentText("");
  };

  const {
    data: commentData,
    isLoading: commentLoading,
    isError: commentError,
  } = useGetAllCommentQuery();

  useEffect(() => {
    if (commentError) {
      console.error("Error fetching comment data:", commentError);
    } else if (!commentLoading) {
      if (commentData && commentData.data) {
        setComments(commentData.data); // Update comments state with fetched comments
      }
    }
  }, [commentData, commentLoading, commentError]);

  const [replyingTo, setReplyingTo] = useState(null);

  const handleReply = (id) => {
    setIsReplying(true);
    setReplyingTo(id);
  };

  const [replyText, setReplyText] = useState(""); // State to handle reply text

  const [createReply] = useCreateReplyMutation();
  const handleReplyToComment = async (postId, commentId) => {
    try {
      // Call the function to post a reply using the replyText state

      const data = {
        postId,
        commentId,
        replyText,
      };
      await createReply(data);
      // Additional logic after successful reply
      setReplyText(""); // Reset reply text after posting
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };

  // Function to update reply text state
  const handleReplyTextChange = (e) => {
    setReplyText(e.target.value);
  };

  const {
    data: replyData,
    isLoading: replyLoading,
    isError: replyError,
  } = useGetAllReplyQuery();

  useEffect(() => {
    if (replyError) {
      console.error("Error fetching comment data:", replyError);
    } else if (!replyLoading) {
      if (replyData && replyData.data) {
        setReplys(replyData.data); // Update comments state with fetched comments
      }
    }
  }, [replyData, replyLoading, replyError]);

  const handleEdit = (commentId) => {
    setIsEditing(true);
    setCommentEditId(commentId);
    // Fetch the comment content or set the content to be edited in the state
    // For instance, if 'comments' is an object with post IDs as keys and arrays of comments as values:
    // const editedContent = comments[post.post_Id][commentIndex].content;
    // setEditedComment(editedContent);
  };

  const [editReplyText, setEditReplyText] = useState("");

  // Function to update reply text state
  const handleEditReplyTextChange = (e) => {
    setEditReplyText(e.target.value);
  };

  const [editComment] = useEditCommentMutation();
  const handleEditedCommentSubmit = async (postId, commentId) => {
    try {
      console.log(
        `Edited comment with ID ${commentId} from post ID ${postId} with this ${editedComment}`
      );
      // Call the mutation to delete the comment on the server
      await editComment({ content: editReplyText, postId, commentId });

      // Log success or perform any other actions after successful deletion
    } catch (error) {
      // Handle error if the mutation fails
      console.error("Error deleting comment:", error);
    }
    // Reset state variables after editing
    setIsEditing(false);
    setEditedComment("");
    // Update state or refetch comments after editing
  };

  const [deleteComment] = useDeleteCommentMutation();
  const handleDelete = async (postId, commentId) => {
    try {
      console.log(
        `Deleted comment with ID ${commentId} from post ID ${postId}`
      );
      // Call the mutation to delete the comment on the server
      await deleteComment({ postId, commentId });

      // Log success or perform any other actions after successful deletion
    } catch (error) {
      // Handle error if the mutation fails
      console.error("Error deleting comment:", error);
    }
  };

  const [editedReply, setEditedReply] = useState(""); // State to handle edited reply text
  const [isReplyEditing, setIsReplyEditing] = useState(false); // State to handle reply editing
  const [replyBeingEdited, setReplyBeingEdited] = useState(null); // State to track which reply is being edited

  const handleEditReply = (replyId) => {
    setIsReplyEditing(true);
    setReplyBeingEdited(replyId);
  };

  const handleEditedReplyTextChange = (e) => {
    setEditedReply(e.target.value);
  };

  const [editReply] = useEditReplyMutation();
  const handleEditedReplySubmit = async (
    postId,
    commentId,
    replyId,
    editedReply
  ) => {
    try {
      const res = await editReply({
        content: editedReply,
        postId,
        commentId,
        replyId,
      });
      // Additional logic after successful reply edit

      console.log("editedReply", editedReply);
      setIsReplyEditing(false); // Reset editing state
      setEditedReply(""); // Reset edited reply text
      // Update state or refetch replies after editing
    } catch (error) {
      console.error("Error editing reply:", error);
    }
  };

  const [deleteReply] = useDeleteReplyMutation();
  const handleDeleteReply = async (postId, commentId, replyId) => {
    try {
      await deleteReply({ postId, commentId, replyId });
      // Additional logic after successful reply deletion
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  return (
    <div className="post-display">
      <h2 className="text-left">Posts</h2>
      {/* Iterate through posts and render each one */}
      {posts.map((post, index) => (
        <div className="post" key={index}>
          {/* Display post content */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                justifyContent: "left",
              }}
            >
              <div className="avatar placeholder">
                <div className=" text-neutral-content rounded-full w-12">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={`https://facebook-feed.onrender.com/${image}`}
                  />
                </div>
              </div>
              <p>{name}</p>
            </div>

            <div className="dropdown dropdown-bottom">
              <div tabIndex={0} role="button" className="btn m-1">
                <FontAwesomeIcon icon={faEllipsis} />
              </div>
              <ul
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-20 "
                style={{ margin: "auto" }}
              >
                <li>
                  {/* Open the modal using document.getElementById('ID').showModal() method */}
                  <button
                    style={{
                      backgroundColor: "white",
                      color: "black",
                    }}
                    className=""
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    Edit
                  </button>

                  <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                      <>
                        <textarea
                          placeholder="Write something..."
                          value={postEditText}
                          onChange={(e) => handleEditTextChange(e)}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </>
                      <div
                        className="modal-action"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleSubmit(post.post_Id, postEditText, editImage)
                          }
                          type="submit"
                        >
                          submit
                        </button>

                        <form method="dialog">
                          {/* if there is a button in form, it will close the modal */}

                          <button className="btn">Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </li>
                <li>
                  <button
                    style={{
                      backgroundColor: "white",
                      color: "black",
                    }}
                    onClick={() => handleDeletePost(post.post_Id)}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-left">{post.content}</p>
          {post.Image && (
            <img
              src={`https://facebook-feed.onrender.com/${post.Image}`}
              alt="Post"
            />
          )}

          <div className="reactions-comments">
            {/* Comment input field */}
            <div className="comment-input">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText[post.post_Id] || ""}
                onChange={(e) => handleCommentChange(post.post_Id, e)}
              />

              <div className="flex gap-2">
                <div>
                  {comments.length > 1 ? (
                    <small>{comments.length} Comments</small>
                  ) : (
                    <small>{comments.length} Comment</small>
                  )}
                </div>

                <div>
                  {replys.length > 1 ? (
                    <small>{replys.length} Replys</small>
                  ) : (
                    <small>{replys.length} Reply</small>
                  )}
                </div>
              </div>
            </div>

            <div className="reaction-container">
              <span
                onClick={() => handleLocalReaction(post.post_Id, "like")}
                className="reaction-btn bg-white"
              >
                👍 {localReactions.like}
              </span>
              <span
                onClick={() => handleLocalReaction(post.post_Id, "love")}
                className="reaction-btn bg-white"
              >
                ❤️ {localReactions.love}
              </span>
              <span
                onClick={() => handleLocalReaction(post.post_Id, "laugh")}
                className="reaction-btn bg-white"
              >
                😆 {localReactions.laugh}
              </span>
              <span
                onClick={() => handleLocalReaction(post.post_Id, "angry")}
                className="reaction-btn bg-white"
              >
                😠 {localReactions.angry}
              </span>
            </div>
            <button onClick={() => handleCommentSubmit(post.post_Id)}>
              Post
            </button>
          </div>

          {comments &&
            comments
              .filter((comment) => comment.postPostId === post.post_Id)
              .map((comment) => (
                <div className="text-left" key={comment.id}>
                  <div
                    className=""
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      justifyContent: "left",
                    }}
                  >
                    <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                      <div className="avatar placeholder">
                        <div className="w-12  text-neutral-content">
                          <img
                            alt=""
                            src={`https://facebook-feed.onrender.com/${image}`}
                          />
                        </div>
                      </div>
                    </div>
                    <p>{comment.content}</p>
                  </div>

                  {/* Buttons for reply, delete, and edit */}
                  <div className="flex gap-2">
                    <small
                      className="cursor-pointer font-semibold"
                      onClick={() => handleReply(comment.id)}
                    >
                      Reply
                    </small>
                    <small
                      className="cursor-pointer font-semibold"
                      onClick={() => handleEdit(comment.id)}
                    >
                      Edit
                    </small>
                    <small
                      className="cursor-pointer font-semibold"
                      onClick={() =>
                        handleDelete(comment.postPostId, comment.id)
                      }
                    >
                      Delete
                    </small>
                  </div>
                  {/* Input field for reply */}
                  {isReplying && replyingTo === comment.id && (
                    <div>
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={handleReplyTextChange}
                      />

                      <button
                        onClick={() =>
                          handleReplyToComment(comment.postPostId, comment.id)
                        }
                      >
                        Post Reply
                      </button>
                    </div>
                  )}

                  {isEditing && commentEditId === comment.id && (
                    <div>
                      <input
                        type="text"
                        placeholder="Write edit reply..."
                        value={editReplyText}
                        onChange={handleEditReplyTextChange}
                      />
                      <button
                        onClick={() =>
                          handleEditedCommentSubmit(
                            comment.postPostId,
                            comment.id
                          )
                        }
                      >
                        Update Reply
                      </button>
                    </div>
                  )}

                  {/* Display replies for this comment */}
                  {replys &&
                    replys
                      .filter((reply) => reply.commentId === comment.id)
                      .map((reply) => (
                        <div className="ms-4" key={reply.id}>
                          <div
                            className=""
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              justifyContent: "left",
                            }}
                          >
                            <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                              <div className="avatar placeholder">
                                <div className="w-12  text-neutral-content">
                                  <img
                                    alt=""
                                    src={`https://facebook-feed.onrender.com/${image}`}
                                  />
                                </div>
                              </div>
                            </div>
                            <p>{reply.content}</p>
                          </div>

                          {/* Buttons for reply, delete, and edit */}
                          <div className="flex gap-2">
                            <small
                              className="cursor-pointer font-semibold"
                              onClick={() => handleEditReply(reply.id)}
                            >
                              Edit
                            </small>
                            <small
                              className="cursor-pointer font-semibold"
                              onClick={() =>
                                handleDeleteReply(
                                  reply.postPostId,
                                  reply.commentId,
                                  reply.id
                                )
                              }
                            >
                              Delete
                            </small>
                          </div>

                          {/* Input field for reply */}
                          {isReplyEditing && replyBeingEdited === reply.id && (
                            <div>
                              <input
                                type="text"
                                placeholder="Write edit reply..."
                                value={editedReply}
                                onChange={(e) => handleEditedReplyTextChange(e)}
                              />
                              <button
                                onClick={() =>
                                  handleEditedReplySubmit(
                                    reply.postPostId,
                                    reply.commentId,
                                    reply.id,
                                    editedReply
                                  )
                                }
                              >
                                Update Reply
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                </div>
              ))}
        </div>
      ))}
    </div>
  );
};

export default PostDisplay;
