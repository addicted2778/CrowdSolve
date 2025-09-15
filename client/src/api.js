import { successMessage, errorMessage } from "./helper/toast";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
export const API_URL_ASSETS =
  process.env.REACT_API_URL_ASSETS || "http://localhost:5000";



export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);
export const removeToken = () => localStorage.removeItem("token");

export async function api(path, options = {}) {

  console.log(process.env.REACT_API_URL_ASSETS,'REACT_API_URL_ASSETS');
  
  const headers = options.headers || {};
  const token = getToken();
  if (token) headers["authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  // Status code handling
  if (res.status == 200) {
    if (data?.message || data?.data?.message) {
      successMessage(data?.message || data?.data?.message);
    }
    return data?.data || data;
  } else {
    // throw new Error(data?.data?.message || "Request failed");
    errorMessage(data?.data?.message || "Request failed");
  }
}

export async function registerUser({ name, email, password }) {
  const data = await api("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (data.token) setToken(data.token);
  return data;
}

export async function loginUser({ email, password }) {
  const data = await api("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (data.token) setToken(data.token);
  return data;
}

export const getPosts = async () => {
  return api(`/posts`);
};

export const getPostById = async (id) => {
  return api(`/posts/${id}`);
};

export const addSolution = (postId, text) => {
  if (!text.trim()) throw new Error("Solution cannot be empty");
  return api(`/posts/${postId}/solutions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};

export const upvoteSolution = (solutionId) =>
  api(`/posts/solutions/${solutionId}/upvote`, { method: "POST" });

export const addComment = (solutionId, text) => {
  if (!text.trim()) throw new Error("Comment cannot be empty");
  return api(`/posts/solutions/${solutionId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};

export const createPost = async ({ title, description, location, image }) => {
  const form = new FormData();
  form.append("title", title);
  form.append("description", description);
  form.append("location", location);
  if (image) form.append("image", image);

  return api("/posts", {
    method: "POST",
    body: form,
  });
};
