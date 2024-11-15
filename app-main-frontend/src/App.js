import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Footer } from "./components/Footer";
import { ChatBox } from "./components/ChatBox/ChatBox";
import { SmallMenu } from "./components/SmallMenu";
import { LargeMenu } from "./components/LargeMenu";
import { SettingsMenu } from "./components/SettingsMenu";
import { Header } from "./components/Header";
import { SummaryBox } from "./components/SummaryFeature/summaryBox";
import { BookRecfeature } from "./components/BookRecommenderFeature/BookRecFeature";

function Right({
  isSmallMenuExpanded,
  isSummaryFeature,
  toggleSummaryFeatureState,
  isBookFeature,
  toggleBookFeatureState,
  currentSession,
}) {
  return (
    <div className={`right-content ${isSmallMenuExpanded ? "shifted" : ""}`}>
      <Header username={`${localStorage.getItem("username")}`} />
      <ChatBox
        isSmallMenuExpanded={isSmallMenuExpanded}
        isFeature={isSummaryFeature || isBookFeature}
        currentSession={currentSession}
      />
      <SummaryBox
        isSummaryFeature={isSummaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
      />
      <BookRecfeature
        isBookfeature={isBookFeature}
        toggleBookFeatureState={toggleBookFeatureState}
      />
      <Footer isSmallMenuExpanded={isSmallMenuExpanded} />
    </div>
  );
}

function Left({
  isSmallMenuExpanded,
  toggleMenu,
  isSummaryFeature,
  toggleSummaryFeatureState,
  isBookFeature,
  toggleBookFeatureState,
  chatSessions,
  handleSessionClick,
}) {
  return (
    <div className="left-content">
      <SmallMenu
        isSmallMenuExpanded={isSmallMenuExpanded}
        toggleMenu={toggleMenu}
        isSummaryFeature={isSummaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
        isBookFeature={isBookFeature}
        toggleBookFeatureState={toggleBookFeatureState}
      />
      <LargeMenu
        isExpanded={isSmallMenuExpanded === "history"}
        chatSessions={chatSessions}
        handleSessionClick={handleSessionClick}
      />
      <SettingsMenu isExpanded={isSmallMenuExpanded === "settings"} />
    </div>
  );
}

function App() {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [summaryFeature, setSummaryFeature] = useState(false);
  const [BookFeature, setBookFeature] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    if (expandedMenu === "history") {
      fetchChatSessions();
    }
  }, [expandedMenu]);

  const fetchChatSessions = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found. Please log in.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5001/api/chats/getChats/${userId}`
      );
      if (response.data.success) {
        setChatSessions(response.data.sessions);
      } else {
        console.error("Failed to fetch chat sessions");
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    }
  };

  const handleSessionClick = (session) => {
    setCurrentSession(session);
    localStorage.setItem("sessionId", session.sessionId);
    console.log("Session loaded:", session.sessionId);
  };

  const toggleMenu = (menu) => {
    setExpandedMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const toggleSummaryFeatureState = () => {
    setSummaryFeature((summaryFeature) => !summaryFeature);
    setExpandedMenu(null);
    setBookFeature(false);
  };

  const toggleBookFeatureState = () => {
    setBookFeature((BookFeature) => !BookFeature);
    setExpandedMenu(null);
    setSummaryFeature(false);
  };

  return (
    <div className="App">
      <Right
        isSmallMenuExpanded={expandedMenu !== null}
        isSummaryFeature={summaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
        isBookFeature={BookFeature}
        toggleBookFeatureState={toggleBookFeatureState}
        currentSession={currentSession}
      />
      <Left
        isSmallMenuExpanded={expandedMenu}
        toggleMenu={toggleMenu}
        isSummaryFeature={summaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
        isBookFeature={BookFeature}
        toggleBookFeatureState={toggleBookFeatureState}
        chatSessions={chatSessions}
        handleSessionClick={handleSessionClick}
      />
    </div>
  );
}

export default App;
