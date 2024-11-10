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

function Right({
  isSmallMenuExpanded,
  isSummaryFeature,
  toggleSummaryFeatureState,
}) {
  return (
    <div className={`right-content ${isSmallMenuExpanded ? "shifted" : ""}`}>
      <Header username={`${localStorage.getItem("username")}`} />
      <ChatBox
        isSmallMenuExpanded={isSmallMenuExpanded}
        isFeature={isSummaryFeature}
      />
      <SummaryBox
        isSummaryFeature={isSummaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
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
  chatSessions,
}) {
  return (
    <div className="left-content">
      <SmallMenu
        isSmallMenuExpanded={isSmallMenuExpanded}
        toggleMenu={toggleMenu}
        isSummaryFeature={isSummaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
      />
      <LargeMenu
        isExpanded={isSmallMenuExpanded === "history"}
        chatSessions={chatSessions}
      />
      <SettingsMenu isExpanded={isSmallMenuExpanded === "settings"} />
    </div>
  );
}

function App() {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [summaryFeature, setSummaryFeature] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);

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

  const toggleMenu = (menu) => {
    setExpandedMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const toggleSummaryFeatureState = () => {
    setSummaryFeature((summaryFeature) => !summaryFeature);
    setExpandedMenu(null);
  };

  return (
    <div className="App">
      <Right
        isSmallMenuExpanded={expandedMenu !== null}
        isSummaryFeature={summaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
      />
      <Left
        isSmallMenuExpanded={expandedMenu}
        toggleMenu={toggleMenu}
        isSummaryFeature={summaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
        chatSessions={chatSessions}
      />
    </div>
  );
}

export default App;
