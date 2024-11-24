import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Filter } from "bad-words";
import parse from 'html-react-parser';
import "./ChatBox.css";

export function ChatBox({ isSmallMenuExpanded, isFeature, currentSession, optionLength, responseType }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const scrollRef = useRef(null);

  const apiKey = process.env.REACT_APP_CHAT_OPENAI_API_KEY;
  const chatAPI = "https://api.openai.com/v1/chat/completions";
  const chatData = {
    model: "gpt-4o-mini",
    temperature: 0.7,
  };

  const filter = new Filter();

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

  const handleSend = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    if (filter.isProfane(userInput)) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Please use appropriate language. This is a kid-friendly bot.",
          sender: "bot",
        },
      ]);
      setUserInput("");
      return;
    }

    const newMessage = { sender: "user", text: userInput };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    setUserInput("");

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

  // CHANGES START HERE
  const getResponse = async (input) => {
    try {
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };

      const formattedMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      let maxTokens;
      let responseInstructions;
      switch(optionLength) {
        case 1: 
        maxTokens = 100;
        responseInstructions = `Provide a brief, concise answer in strictly not more than ${maxTokens} tokens.`;
        break;
      case 2: 
        maxTokens = 200;
        responseInstructions = `Provide a moderately detailed answer in strictly not more than ${maxTokens} tokens.`;
        break;
      case 3: 
        maxTokens = 400;
        responseInstructions = `Provide a comprehensive answer in strictly not more than ${maxTokens} tokens.`;
        break;
      default: 
        maxTokens = 200;
        responseInstructions = "Provide a moderately detailed answer.";
      }

      const formattedResponseType = responseType === 'bullet' 
        ? 'in bullet points' 
        : 'in descriptive paragraphs';

      const extendedInput = `${input} ${responseInstructions} Please answer the question ${formattedResponseType}. Ensure the response is complete and coherent without cutting off mid-thought. Also, classify the genre of science this belongs to (Physics, Chemistry, Biology, Astronomy, Geology, Ecology, Oceanography, Meteorology, Environmental Science, Mathematics, Statistics, Computer Science, Logic, Systems Science, Medicine, Engineering, Agricultural Science, Environmental Engineering, Forensic Science, Information Technology). If not applicable, return NONE. Return the genre as 'GENRE:<genre>' but do not include it in the visible output.`;

      const data = {
        ...chatData,
        max_tokens: maxTokens,
        messages: [
          ...formattedMessages,
          { role: "user", content: extendedInput }
        ],
      };

      const response = await axios.post(chatAPI, data, { headers });

      let responseContent = response.data.choices[0].message.content;

      // response format
      if (responseType === 'bullet') {
        // Move content after dash to a new line, then remove dash and bold text between dash and colon
        responseContent = responseContent.replace(/- (.*)/g, '<br>$1');
        responseContent = responseContent.replace(/<br>(.*?):/g, '<br><strong>$1:</strong>');
        
        // Ensure each bullet point starts on a new line
        responseContent = responseContent.replace(/•/g, '<br>•');
        responseContent = responseContent.replace(/^\s*•/gm, '$1<br>•');
        responseContent = responseContent.replace(/^<br>/, '');
      } else {
        // Format paragraphs
        responseContent = responseContent.replace(/\n\n/g, '<br><br>');
      }
      
      // Additional formatting for bold and italic
      responseContent = responseContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      responseContent = responseContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
      responseContent = responseContent.replace(/__(.*?)__/g, '<u>$1</u>');

      const genreMatch = responseContent.match(/GENRE:([\w\s]+)/i);

      if (genreMatch) {
        const genre = genreMatch[1].trim();
        if (genre === "NONE") {
          console.log("Detected Genre: NONE");
          return "Please ask a question that is related to science.";
        }
        console.log("Detected Genre:", genre);
      }

      return responseContent.replace(/GENRE:([\w\s]+)/i, "").trim();
    } catch (error) {
      console.error("Failed to fetch the desired response:", error);
      throw new Error("API call failed");
    }
  };
  // CHANGES END HERE

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
            {message.sender === "user" ? (
              <p>{message.text}</p>
            ) : (
              <div>{parse(message.text)}</div>
            )}
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