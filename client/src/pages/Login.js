import React, { useState } from "react";
import { loginUser, setToken } from "../api"; 
import { useNavigate } from "react-router-dom";
export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const nav = useNavigate();
  // Simple validation
  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Email is invalid";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setApiError("");
    try {
      const res = await loginUser({ email, password });
      setToken(res.token);     
      localStorage.setItem("user", JSON.stringify(res.user));
      setLoggedIn(true);
      nav("/"); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Login</h2>

      {apiError && <div style={{ color: "red", marginBottom: 10 }}>{apiError}</div>}

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
        {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
      </div>

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
        {errors.password && <div style={{ color: "red" }}>{errors.password}</div>}
      </div>

      <button onClick={submit} style={{ padding: "8px 16px" }}>
        Login
      </button>
    </div>
  );
}
