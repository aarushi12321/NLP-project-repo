import React, { useState } from "react";
import "./App.css";
import { Footer } from "./components/Footer";
import { ChatBox } from "./components/ChatBox/ChatBox";
import { SmallMenu } from "./components/SmallMenu";
import { LargeMenu } from "./components/LargeMenu";
import { SettingsMenu } from "./components/SettingsMenu";
import { Header } from "./components/Header";
import { ChatBoxInteraction } from "./components/NLPFeatures/ChatBoxInteract";

function Right({ isSmallMenuExpanded, isSummaryFeature }) {
  return (
    <div className={`right-content ${isSmallMenuExpanded ? "shifted" : ""}`}>
      <Header username={`${localStorage.getItem("username")}`} />
      <ChatBoxInteraction
        isSmallMenuExpanded={isSmallMenuExpanded}
        isFeature={isSummaryFeature}
      />
      <ChatBox
        isSmallMenuExpanded={isSmallMenuExpanded}
        isFeature={isSummaryFeature}
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
}) {
  return (
    <div className="left-content">
      <SmallMenu
        isSmallMenuExpanded={isSmallMenuExpanded}
        toggleMenu={toggleMenu}
        isSummaryFeature={isSummaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
      />
      <LargeMenu isExpanded={isSmallMenuExpanded === "history"} />
      <SettingsMenu isExpanded={isSmallMenuExpanded === "settings"} />
    </div>
  );
}

function App() {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [summaryFeature, setSummaryFeature] = useState(false);

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
      />
      <Left
        isSmallMenuExpanded={expandedMenu}
        toggleMenu={toggleMenu}
        isSummaryFeature={summaryFeature}
        toggleSummaryFeatureState={toggleSummaryFeatureState}
      />
    </div>
  );
}

export default App;
