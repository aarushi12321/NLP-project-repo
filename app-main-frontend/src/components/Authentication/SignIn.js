import React, { useState } from "react";
import axios from "axios";

export function SignIn({ onAuthSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/signin", {
        username,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("username", username);
        localStorage.setItem("userId", response.data.userId);
        console.log("User ID stored in localStorage:", response.data.userId);

        onAuthSuccess();
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("SignIn error:", error);
      alert("An error occurred during sign-in. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
