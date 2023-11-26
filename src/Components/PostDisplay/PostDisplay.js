import React, { useState, useEffect } from "react";
import "./PostDisplay.css"; // Your CSS file for styling
import {
  useEditPostMutation,
  useGetAllPostQuery,
} from "../../features/post/post";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useGetAllCommentQuery,
} from "../../features/comment/comment";

const PostDisplay = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState("");
  const [localReactions, setLocalReactions] = useState({
    like: 0,
    love: 0,
    laugh: 0,
    angry: 0,
  });

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

  const [editPost] = useEditPostMutation();

  const handleLocalReaction = async (postId, reactionType) => {
    try {
      // Call the mutation to update the post on the server
      await editPost({ id: postId, data: reactionType });

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
      content: JSON.stringify(commentText),
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

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Fetch the comment content or set the content to be edited in the state
    // For instance, if 'comments' is an object with post IDs as keys and arrays of comments as values:
    // const editedContent = comments[post.post_Id][commentIndex].content;
    // setEditedComment(editedContent);
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

  const [editComment] = useEditCommentMutation();
  const handleEditedCommentSubmit = async (postId, commentId) => {
    try {
      console.log(
        `Edited comment with ID ${commentId} from post ID ${postId} with this ${editedComment}`
      );
      // Call the mutation to delete the comment on the server
      await editComment({ content: editedComment, postId, commentId });

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

  return (
    <div className="post-display">
      <h2 className="text-left">Posts</h2>
      {/* Iterate through posts and render each one */}
      {posts.map((post, index) => (
        <div className="post" key={index}>
          {/* Display post content */}
          <p className="text-left">{post.content}</p>
          {post.Image && (
            <img src={`http://localhost:5000/${post.Image}`} alt="Post" />
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
                  <p>{comment.content}</p>
                  {/* Buttons for reply, delete, and edit */}
                  <div className="flex gap-2">
                    <small
                      className="cursor-pointer font-semibold"
                      onClick={handleReply}
                    >
                      Reply
                    </small>
                    <small
                      className="cursor-pointer font-semibold"
                      onClick={() =>
                        handleEdit(comment.post_Id, comment.comment_Id)
                      }
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
                  {isReplying && (
                    <div>
                      <input type="text" placeholder="Write a reply..." />
                      <button className="mb-2">Post Reply</button>
                    </div>
                  )}
                  {/* Input field for editing */}
                  {isEditing && (
                    <div>
                      <input
                        type="text"
                        placeholder="Edit your comment..."
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                      />
                      <button
                        onClick={() =>
                          handleEditedCommentSubmit(
                            comment.postPostId,
                            comment.id
                          )
                        }
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              ))}
        </div>
      ))}
    </div>
  );
};

export default PostDisplay;
