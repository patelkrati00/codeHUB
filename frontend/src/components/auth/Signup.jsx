import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/gitHubLogo.png";
import "./auth.css";

import { Button, TextInput, Label } from "@primer/react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/signup", {
        email,
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrUser(res.data.userId);
      navigate("/");
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Signup Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="signup-page">
    <img src={logo} alt="GitHub Logo" className="signup-logo" />
    <h1 className="signup-title">Create your account</h1>

    <form onSubmit={handleSignup} className="signup-form">
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label htmlFor="email">Email address</label>
      <input
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="signup-btn" disabled={loading}>
        {loading ? "Signing Up..." : "Sign Up"}
      </button>

      <div className="signup-footer">
        Already have an account? <Link to="/auth">Login</Link>
      </div>
    </form>
  </div>
);
};

export default Signup;
