import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faHistory } from "@fortawesome/free-solid-svg-icons";

export function SmallMenu({ isSmallMenuExpanded, toggleMenu }) {
  return (
    <div className="small-menu-container">
      <button
        onClick={toggleMenu}
        className={`history-toggle-button ${
          isSmallMenuExpanded ? "expanded" : ""
        }`}
      >
        <FontAwesomeIcon icon={faHistory} color="white" />
      </button>
    </div>
  );
}
