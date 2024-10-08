import React from "react";

export function ChatBoxInteraction({ isSmallMenuExpanded, isFeature }) {
  return (
    <div
      className={`chat-box-interaction-container ${
        isSmallMenuExpanded ? "shifted" : ""
      } ${isFeature ? "active-feature" : ""}`}
    >
      <p>This is where the chat happens</p>
    </div>
  );
}
