import React, { useState } from "react";
import "./App.css";
import { Footer } from "./components/Footer";
import { ChatBox } from "./components/ChatBox/ChatBox";
import { SmallMenu } from "./components/SmallMenu";
import { LargeMenu } from "./components/LargeMenu";
import { SettingsMenu } from "./components/SettingsMenu";
import { Header } from "./components/Header";
import { ChatBoxInteraction } from "./components/NLPFeatures/ChatBoxInteract";

function Right({ isSmallMenuExpanded}) {
  return (
    <div className={`right-content ${isSmallMenuExpanded ? "shifted" : ""}`}>
      <Header username={`${localStorage.getItem("username")}`} />
      <ChatBoxInteraction isSmallMenuExpanded={isSmallMenuExpanded} />
      <ChatBox isSmallMenuExpanded={isSmallMenuExpanded} />
      <Footer isSmallMenuExpanded={isSmallMenuExpanded} />
    </div>
  );
}

function Left({ isSmallMenuExpanded , toggleMenu}) {
  return (
    <div className="left-content">
      <SmallMenu
        isSmallMenuExpanded={isSmallMenuExpanded}
        toggleMenu={toggleMenu}
      />
      <LargeMenu isExpanded={isSmallMenuExpanded === "history"} />
      <SettingsMenu isExpanded={isSmallMenuExpanded === "settings"} />
    </div>
  );
}

function App() {
  const [expandedMenu, setExpandedMenu] = useState(null); // track which menu is expanded

  const toggleMenu = (menu) => {
    setExpandedMenu((prevMenu) => (prevMenu === menu ? null : menu)); // toggle between history, settings, and closing both
  };

  return (
    <div className="App">
      <Right isSmallMenuExpanded={expandedMenu !== null} />
      <Left isSmallMenuExpanded={expandedMenu} toggleMenu={toggleMenu} />
    </div>
  );
}

export default App;
