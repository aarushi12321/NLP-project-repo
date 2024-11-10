import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBox.css";

export function ChatBox({ isSmallMenuExpanded, isFeature }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const scrollRef = useRef(null);

  const apiKey = process.env.REACT_APP_CHAT_OPENAI_API_KEY;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleReset = async (event) => {
    event.preventDefault();
    setMessages([]);

    const userId = localStorage.getItem("userId");
    console.log(userId);
    if (!userId) {
      console.error("User ID not found. Please log in.");
      return;
    }

    const sessionId = `session_${Date.now()}`;

    try {
      await axios.post("http://localhost:5001/api/chats/saveChat", {
        userId: userId,
        sessionId: sessionId,
        chatHistory: [],
      });

      localStorage.setItem("sessionId", sessionId);

      console.log("New chat session created:", sessionId);
    } catch (error) {
      console.error("Error saving the new chat session:", error);
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = { sender: "user", text: userInput };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    console.log("User message added:", newMessage);

    setUserInput("");

    try {
      const response = await getBotResponse(userInput);
      const botMessage = { text: response, sender: "bot" };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      console.log("Bot response added:", botMessage);

      const userId = localStorage.getItem("userId");
      const sessionId = localStorage.getItem("sessionId");

      console.log("Session Id :", sessionId);

      if (userId) {
        try {
          let existingSession;
          try {
            const sessionResponse = await axios.get(
              `http://localhost:5001/api/chats/getChats/${userId}`
            );
            existingSession = sessionResponse.data.sessions.find(
              (session) => session.sessionId === sessionId
            );
          } catch (error) {
            console.error("Error checking for existing session:", error);
          }

          if (existingSession) {
            console.log("This session exists.");
            await axios.put(
              `http://localhost:5001/api/chats/updateChat/${sessionId}`,
              {
                chatHistory: finalMessages,
              }
            );
            console.log("Chat history updated successfully.");
          } else {
            const newSessionId = `session_${Date.now()}`;
            localStorage.setItem("sessionId", newSessionId);
            await axios.post("http://localhost:5001/api/chats/saveChat", {
              userId: userId,
              sessionId: newSessionId,
              chatHistory: finalMessages,
            });
            console.log("New chat session created successfully.");
          }
        } catch (error) {
          console.error("Error updating or creating chat session:", error);
        }
      } else {
        console.error("User ID not found. Please log in.");
      }
    } catch (error) {
      console.error("Error fetching the response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, something went wrong. Please try again.",
          sender: "bot",
        },
      ]);
    }
  };

  const getBotResponse = async (message) => {
    try {
      const api = "https://api.openai.com/v1/chat/completions";
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };

      const data = {
        model: "gpt-4o-mini",
        max_tokens: 150,
        temperature: 0.7,
        messages: [
          { role: "system", content: "Some help would be appreciated" },
          { role: "user", content: message },
        ],
      };

      const response = await axios.post(api, data, { headers });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Failed to fetch the desired response:", error);
      throw new Error("API call failed");
    }
  };

  return (
    <div
      className={`chatbot-query-container ${
        isSmallMenuExpanded ? "shifted" : ""
      } ${isFeature ? "feature-active" : ""}`}
    >
      <div className="chat-box" ref={scrollRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user" : "bot"}`}
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask a science question..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend(e);
            }
          }}
        />
        <button type="submit" className="send-button">
          Send
        </button>
        <button className="reset-chat-button" onClick={handleReset}>
          Reset Chat
        </button>
      </form>
    </div>
  );
}
