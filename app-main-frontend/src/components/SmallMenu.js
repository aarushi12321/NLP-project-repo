import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faBrain,
  faCogs,
  faHistory,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";

export function SmallMenu({
  isSmallMenuExpanded,
  toggleMenu,
  isSummaryFeature,
  toggleSummaryFeatureState,
}) {
  return (
    <div className="small-menu-container">
      <button
        onClick={() => toggleMenu("history")}
        className={`history-toggle-button ${
          isSmallMenuExpanded === "history" ? "expanded-history" : ""
        }`}
      >
        <FontAwesomeIcon icon={faHistory} color="white" />
      </button>
      <button
        onClick={() => toggleMenu("settings")}
        className={`settings-toggle-button ${
          isSmallMenuExpanded === "settings" ? "expanded-settings" : ""
        }`}
      >
        <FontAwesomeIcon icon={faCogs} color="white" />
      </button>
      <button
        onClick={toggleSummaryFeatureState}
        className={`summary-feature-button ${
          isSummaryFeature ? "summary-feature-active" : "summary-feature-inactive"
        }`}
      >
        <FontAwesomeIcon icon={faListAlt} color="white" />
      </button>

      <button className={`book-recommender-feature-button`}>
        <FontAwesomeIcon icon={faBookmark} color="white" />
      </button>

      <button className={`quiz-me-feature-button`}>
        <FontAwesomeIcon icon={faBrain} color="white" />
      </button>
    </div>
  );
}
