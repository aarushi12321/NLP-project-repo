import React from "react";

export function ChatBoxInteraction({ isSmallMenuExpanded }) {
  return (
    <div className={`chat-box-interaction-container ${
        isSmallMenuExpanded ? "shifted" : ""
      }`}>
      <p>This is where the chat happens</p>
    </div>
  );
}
