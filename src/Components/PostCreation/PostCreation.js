import React, { useState } from "react";
import "./PostCreation.css";
import { useCreatePostMutation } from "../../features/post/post";
import PostDisplay from "../PostDisplay/PostDisplay";
import { Link } from "react-router-dom";
import Header from "../Header/Header";

const PostCreation = () => {
  const [postType, setPostType] = useState("text");
  const [postText, setPostText] = useState("");
  const [postBackgroundText, setPostBackgroundText] = useState("");
  const [image, setImage] = useState(null);

  const handleBackgroundTextChange = (e) => {
    setPostBackgroundText(e.target.value);
  };
  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleTypeChange = (type) => {
    setPostType(type);
  };

  const [createPost] = useCreatePostMutation();
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Image", image);
    formData.append("content", postText);
    formData.append("background", postBackgroundText);
    // Handle submission logic based on postType (text, image, etc.)
    console.log("Post Type:", postType);
    console.log("Post Text:", postText);
    console.log("Image File:", image);

    createPost(formData);
    // Add your logic to send data to the server or perform any other actions
  };

  let inputSection;
  if (postType === "text") {
    inputSection = (
      <textarea
        placeholder="What's on your mind?"
        value={postText}
        onChange={handleTextChange}
      />
    );
  } else if (postType === "textImage") {
    inputSection = (
      <>
        <textarea
          placeholder="Write something..."
          value={postText}
          onChange={handleTextChange}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </>
    );
  } else if (postType === "image") {
    inputSection = (
      <input type="file" accept="image/*" onChange={handleImageChange} />
    );
  } else if (postType === "background") {
    inputSection = (
      <div className="background-post">
        <textarea
          placeholder="Write something..."
          value={postBackgroundText}
          onChange={handleBackgroundTextChange}
        />
      </div>
    );
  }

  return (
    <div className="post-creation">
      <div className="flex justify-between align-middle">
        <h2>Create a Post</h2>
        <Header />
        {/* <div className="navbar bg-base-100"></div> */}
      </div>
      <form onSubmit={handleSubmit}>
        {inputSection}
        <div className="post-types flex justify-between mb-2 ">
          <button onClick={() => handleTypeChange("text")}>Text</button>
          <button onClick={() => handleTypeChange("textImage")}>
            Text + Image
          </button>
          <button onClick={() => handleTypeChange("image")}>Image</button>
          <button onClick={() => handleTypeChange("background")}>
            Background Post
          </button>
        </div>
        <button type="submit">Post</button>
      </form>
      {/* Post options displayed below the post creation box */}
      <div className="post-options">
        <p className="text-left text-xl mt-4">
          Here are some additional options for posts...
        </p>
        <PostDisplay />
      </div>
    </div>
  );
};

export default PostCreation;
