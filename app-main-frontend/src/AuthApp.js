import React, { useState } from "react";
import "./App.css";
import { AuthPage } from "./components/Authentication/AuthPage";
import App from "./App";

function AuthApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  return (
    <div className="AuthApp">
      {isAuthenticated ? (
        <App />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default AuthApp;
