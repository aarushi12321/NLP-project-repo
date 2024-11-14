import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBox.css";

export function ChatBox({ isSmallMenuExpanded, isFeature, currentSession }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const scrollRef = useRef(null);

  const apiKey = process.env.REACT_APP_CHAT_OPENAI_API_KEY;
  const chatAPI = "https://api.openai.com/v1/chat/completions";
  const chatData = {
    model: "gpt-4o-mini",
    max_tokens: 150,
    temperature: 0.7
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (currentSession) {
      setMessages(currentSession.chatHistory);
    }
  }, [currentSession]);

  const handleReset = async (event) => {
    event.preventDefault();
    setMessages([]);

    const userId = localStorage.getItem("userId");
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
    } catch (error) {
      console.error("Error saving the new chat session:", error);
    }
  };

  const isAmbiguous = async (userInput) => {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    const gptPrompt = `
    Return true if the prompt is incomplete or too vague for you to respond. ELse return false':
    "${userInput}"
    `;

    const formattedMessages = [
      { role: "user", content: gptPrompt }
    ];

    const data = {
      ...chatData,
      messages: formattedMessages,
    };

    try {
      const response = await axios.post(chatAPI, data, { headers });
      const isAmbiguousPrompt = response.data.choices[0].message.content;
      return isAmbiguousPrompt === "True"; 
    } catch (error) {
      console.error("Unsure if the prompt is vague", error);
      return false;
    }
  };

  const isIncomplete = (userInput) => {
    const trimmedInput = userInput.trim();

    const incompleteQuestions = [
      "how does",
      "how to",
      "what is",
      "why is",
      "how can",
      "explain the",
      "give explaination"
    ];

    return incompleteQuestions.some(inc => trimmedInput.toLowerCase().startsWith(inc)) && !trimmedInput.includes("?");
  };

  const isScienceRelated = async(userInput) => {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    const gptPrompt = `
    Return true if this is a science question, else return false.
    Question: "${userInput}"
    Answer: `;

    const formattedMessages = messages.map((msg) => ({
      role: "user",
      content: gptPrompt
    }));

    const data = {
      ...chatData,
      messages: formattedMessages,
    };
  
  try {
    const response = await axios.post(chatAPI, data, { headers });
    const isScienceRelated = response.data.choices[0].message.content;
    return isScienceRelated === "True"; 
  } catch (error) {
    console.error("Not sure if this is a science question!", error);
    return false; 
  }
  }

  const handleSend = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = { sender: "user", text: userInput };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    setUserInput("");

    const isIncompleteInput = await isIncomplete(userInput);
    if (isIncompleteInput) {
      const botMessage = {
        text: "Please enter a complete question/prompt",
        sender: "bot",
      };
      setMessages([...updatedMessages, botMessage]);
      return;
    }

    const isAmbiguousInput = await isAmbiguous(userInput);
    if (isAmbiguousInput) {
      const botMessage = {
        text: "Please enter a complete and unambiguous prompt",
        sender: "bot",
      };
      setMessages([...updatedMessages, botMessage]);
      return;
    }

    const isScienceRelatedInput = await isScienceRelated(userInput);
    if (!isScienceRelatedInput) {
      const botMessage = {
        text: "This is a science chatbot. Please ask a science-related question. For example: What is photosynthesis?",
        sender: "bot",
      };
      setMessages([...updatedMessages, botMessage]);
      return;
    }

    try {
      const response = await getResponse(userInput);
      const botMessage = { text: response, sender: "bot" };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      const userId = localStorage.getItem("userId");
      const sessionId = localStorage.getItem("sessionId");

      if (userId) {
        try {
          const sessionResponse = await axios.get(
            `http://localhost:5001/api/chats/getChats/${userId}`
          );
          const existingSession = sessionResponse.data.sessions.find(
            (session) => session.sessionId === sessionId
          );

          if (existingSession) {
            await axios.put(
              `http://localhost:5001/api/chats/updateChat/${sessionId}`,
              {
                chatHistory: finalMessages,
              }
            );
          } else {
            const newSessionId = `session_${Date.now()}`;
            localStorage.setItem("sessionId", newSessionId);
            await axios.post("http://localhost:5001/api/chats/saveChat", {
              userId: userId,
              sessionId: newSessionId,
              chatHistory: finalMessages,
            });
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

  const getResponse = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };

      const formattedMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      formattedMessages.push({ role: "user", content: userInput });

      const data ={
        ...chatData, messages: formattedMessages
      }
      const response = await axios.post(chatAPI, data, { headers });
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
