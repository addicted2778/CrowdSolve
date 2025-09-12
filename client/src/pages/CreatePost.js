import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getToken } from "../api";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const nav = useNavigate();

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!location.trim()) errs.location = "Location is required";
    if (!description.trim()) errs.description = "Description is required";

    if (image) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(image.type)) {
        errs.image = "Only JPG, PNG images are allowed";
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (image.size > maxSize) {
        errs.image = "Image must be less than 5MB";
      }
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    try {
      await createPost({ title, description, location, image });
      nav("/");
    } catch (err) {
      alert(err.message);
    }
  };
  useEffect(() => {
    if (!getToken()) {
      nav("/login");
    }
  }, []);
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h2>Create Post</h2>

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
        {errors.title && <div style={{ color: "red" }}>{errors.title}</div>}
      </div>

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
        {errors.location && (
          <div style={{ color: "red" }}>{errors.location}</div>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: 8, minHeight: 100 }}
        />
        {errors.description && (
          <div style={{ color: "red" }}>{errors.description}</div>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        {errors.image && <div style={{ color: "red" }}>{errors.image}</div>}
      </div>

      <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>
        Create
      </button>
    </div>
  );
}
