import React, { useState } from 'react';
import "./App.css";
import { Footer } from "./components/Footer";
import { ChatBox } from "./components/ChatBox";
import { SmallMenu } from "./components/SmallMenu";
import { LargeMenu } from "./components/LargeMenu";

function Right( { isSmallMenuExpanded }) {
  return (
    <div className={`right-content ${isSmallMenuExpanded ? 'shifted' : ''}`}>
    <ChatBox isSmallMenuExpanded={isSmallMenuExpanded} />
    <Footer isSmallMenuExpanded={isSmallMenuExpanded}/>
  </div>
  );
}

function Left( {isSmallMenuExpanded, toggleMenu} ) {
  return (
    <div className="left-content">
    <SmallMenu isSmallMenuExpanded={isSmallMenuExpanded} toggleMenu={toggleMenu}/>
    {isSmallMenuExpanded && <LargeMenu />}
  </div>
  );
}

function App() {
  const [isSmallMenuExpanded, setIsSmallMenuExpanded] = useState(false);

  const toggleMenu = () => {
    setIsSmallMenuExpanded(!isSmallMenuExpanded);
  }
  return (
    <div className="App">
      <Right isSmallMenuExpanded={isSmallMenuExpanded}/>
      <Left isSmallMenuExpanded={isSmallMenuExpanded} toggleMenu={toggleMenu}/>
    </div>
  );
}

export default App;
