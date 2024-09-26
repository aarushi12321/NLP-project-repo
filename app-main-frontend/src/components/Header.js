import React from "react";

export function Header({ username }) {
  const initial = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <header className="header">
      <div className="id-container">
        <span className="id">{initial}</span>
      </div>
      <h1 className="title">ChatBot</h1>
    </header>
  );
}
