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
import { QuizFeature } from "./components/QuizFeatureFolder/QuizFeature";
import OnboardingTour from "./components/Onboarding/OnboardingTour";

function Right({
  isSmallMenuExpanded,
  isSummaryFeature,
  toggleSummaryFeatureState,
  isBookFeature,
  toggleBookFeatureState,
  isQuizFeature,
  toggleQuizFeatureState,
  currentSession,
}) {
  return (
    <div className={`right-content ${isSmallMenuExpanded ? "shifted" : ""}`}>
      <Header username={`${localStorage.getItem("username")}`} />
      {!isSummaryFeature && !isBookFeature && !isQuizFeature && (
        <ChatBox
          isSmallMenuExpanded={isSmallMenuExpanded}
          isFeature={isSummaryFeature || isBookFeature || isQuizFeature}
          currentSession={currentSession}
        />
      )}
      {isSummaryFeature && (
        <SummaryBox
          isSummaryFeature={isSummaryFeature}
          toggleSummaryFeatureState={toggleSummaryFeatureState}
        />
      )}
      {isBookFeature && (
        <BookRecfeature
          isBookfeature={isBookFeature}
          toggleBookFeatureState={toggleBookFeatureState}
          currentSession={currentSession}
        />
      )}
      {isQuizFeature && (
        <QuizFeature
          isQuizFeature={isQuizFeature}
          toggleQuizFeatureState={toggleQuizFeatureState}
          currentSession={currentSession}
        />
      )}
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
  isQuizFeature,
  toggleQuizFeatureState,
  chatSessions,
  handleSessionClick,
  setRun,
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
        isQuizFeature={isQuizFeature}
        toggleQuizFeatureState={toggleQuizFeatureState}
        setRun={setRun}
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
  const [QuizFeature, setQuizFeature] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setRun(true);
  }, []);

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
    setQuizFeature(false);
  };

  const toggleBookFeatureState = () => {
    setBookFeature((BookFeature) => !BookFeature);
    setExpandedMenu(null);
    setSummaryFeature(false);
    setQuizFeature(false);
  };
  
  const toggleQuizFeatureState = () => {
    setQuizFeature((prevQuizFeature) => !prevQuizFeature);
    setExpandedMenu(null);
    setSummaryFeature(false);
    setBookFeature(false);
  };
  return (
    <div className="App">
      <Right
        isSmallMenuExpanded={expandedMenu !== null}
        isSummaryFeature={summaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
        isBookFeature={BookFeature}
        toggleBookFeatureState={toggleBookFeatureState}
        isQuizFeature={QuizFeature}
        toggleQuizFeatureState={toggleQuizFeatureState}
        currentSession={currentSession}
      />
      <Left
        isSmallMenuExpanded={expandedMenu}
        toggleMenu={toggleMenu}
        isSummaryFeature={summaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
        isBookFeature={BookFeature}
        toggleBookFeatureState={toggleBookFeatureState}
        isQuizFeature={QuizFeature}
        toggleQuizFeatureState={toggleQuizFeatureState}
        chatSessions={chatSessions}
        handleSessionClick={handleSessionClick}
        setRun={setRun}
      />
      {run && <OnboardingTour />}
    </div>
  );
}

export default App;
