import React, { useEffect, useState } from "react";
import { getPosts, API_URL_ASSETS } from "../api";
import { useNavigate } from "react-router-dom";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getPosts();
       
        setPosts(res?.posts || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!posts.length) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h3>No posts found</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Posts</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {posts.map((p) => (
          <div
            key={p._id}
            onClick={() => navigate(`/posts/${p._id}`)}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {p.imageUrl && (
              <img
              
                src={`${API_URL_ASSETS}${p.imageUrl}`}
                alt={p.title}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />
            )}
            <div style={{ padding: 15 }}>
              <h3 style={{ margin: "0 0 10px 0" }}>{p.title}</h3>
              <p style={{ margin: "0 0 10px 0", color: "#555" }}>{p.location}</p>
              <p style={{ margin: 0, color: "#333" }}>
                {p.description?.length > 100
                  ? p.description.slice(0, 100) + "..."
                  : p.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
