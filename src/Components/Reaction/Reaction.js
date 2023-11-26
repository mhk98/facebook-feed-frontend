import { useState } from "react";
import "./Reaction.css";

const Reaction = ({ postId, reactions, handleReaction }) => {
  const [localReactions, setLocalReactions] = useState(reactions);

  const handleLocalReaction = (reactionType) => {
    setLocalReactions((prevReactions) => ({
      ...prevReactions,
      [reactionType]: prevReactions[reactionType] + 1,
    }));
    handleReaction(postId, reactionType);
  };

  return (
    <div className="reaction-container">
      <button
        onClick={() => handleLocalReaction("like")}
        className="reaction-btn"
      >
        👍 {localReactions.like}
      </button>
      <button
        onClick={() => handleLocalReaction("love")}
        className="reaction-btn"
      >
        ❤️ {localReactions.love}
      </button>
      <button
        onClick={() => handleLocalReaction("laugh")}
        className="reaction-btn"
      >
        😆 {localReactions.laugh}
      </button>
      <button
        onClick={() => handleLocalReaction("angry")}
        className="reaction-btn"
      >
        😠 {localReactions.angry}
      </button>
    </div>
  );
};

export default Reaction;
