import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { successMessage, errorMessage } from "../helper/toast";
import {
  getPostById,
  addSolution,
  addComment,
  upvoteSolution,
  getToken,
  API_URL_ASSETS
} from "../api";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [solutionText, setSolutionText] = useState("");
  const [commentText, setCommentText] = useState({});
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await getPostById(id);
      setPost(data.post);
    } catch (err) {
      console.error(err);
      errorMessage(err.message || "Failed to load post");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleAddSolution = async () => {
    if (!solutionText.trim()) {
      errorMessage("Solution cannot be empty");
      return;
    }
    try {
      await addSolution(id, solutionText);
      setSolutionText("");
      setError("");
      load();
    } catch (err) {
      
    }
  };

  const handleUpvote = async (solutionId) => {
    try {
      await upvoteSolution(solutionId);
      load();
    } catch (err) {
      
    }
  };

  const handleAddComment = async (solutionId) => {
    const text = commentText[solutionId]?.trim();
    if (!text) {
      
      errorMessage("Comment cannot be empty.");
      return;
    }
    try {
      await addComment(solutionId, text);
      setCommentText((prev) => ({ ...prev, [solutionId]: "" }));
      setError("");
      load();
    } catch (err) {
      setError(err.message || "Error adding comment");
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>{post.title}</h2>
      <p><em>{post.location}</em></p>
      {post.imageUrl && (
        <img
          src={`${API_URL_ASSETS}${post.imageUrl}`}
          style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
          alt=""
        />
      )}
      <p>{post.description}</p>

      <hr />
      <h3>Solutions</h3>
      {post.solutions?.map((s) => (
        <div
          key={s._id}
          style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}
        >
          <p><strong>{s.authorName}</strong> said:</p>
          <p>{s.text}</p>
          <p>
            Upvotes: {s.upvotes?.length || 0}{" "}
            <button onClick={() => handleUpvote(s._id)}>Toggle Upvote</button>
          </p>

          <div>
            <strong>Comments</strong>
            {s.comments
              ?.filter((c) => c.text?.trim())
              .map((c) => (
                <div key={c._id}>
                  <em>{c.authorName}</em>: {c.text}
                </div>
              ))}

            {getToken() && (
              <div>
                <input
                  placeholder="Comment"
                  value={commentText[s._id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [s._id]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => handleAddComment(s._id)}>
                  Add Comment
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {getToken() && (
        <div>
          <h4>Add Solution</h4>
          <textarea
            value={solutionText}
            onChange={(e) => setSolutionText(e.target.value)}
          />
          <button onClick={handleAddSolution}>Submit Solution</button>
        </div>
      )}
    </div>
  );
}
