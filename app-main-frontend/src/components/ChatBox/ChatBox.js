import React, { useState } from "react";
import axios from "axios";
import "./ChatBox.css";

export function ChatBox({ isSmallMenuExpanded, isFeature }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleReset = (event) => {
    event.preventDefault();
    setMessages([]);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = { role: "user", content: userInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setUserInput("");

    try {
      const response = await axios.post("/chat", { message: userInput });
      const botMessage = { role: "bot", content: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching the response:", error);
    }
  };

  return (
    <div
      className={`chatbot-query-container ${
        isSmallMenuExpanded ? "shifted" : ""
      } ${isFeature ? "feature-active" : ""}`}
    >
      <form className="chat-input-form">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={msg.role}>
              {msg.content}
            </div>
          ))}
        </div>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask a science question..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit" className="send-button" onClick={handleSend}>
          Send
        </button>
        <button className="reset-chat-button" onClick={handleReset}>
          Reset Chat
        </button>
      </form>
    </div>
  );
}
