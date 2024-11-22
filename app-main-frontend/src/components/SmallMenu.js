import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faBrain,
  faCircleInfo,
  faCogs,
  faHistory,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";

export function SmallMenu({
  isSmallMenuExpanded,
  toggleMenu,
  isSummaryFeature,
  toggleSummaryFeatureState,
  isBookFeature,
  toggleBookFeatureState,
  isQuizFeature,
  toggleQuizFeatureState,
  setRun,
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
          isSummaryFeature
            ? "summary-feature-active"
            : "summary-feature-inactive"
        }`}
      >
        <FontAwesomeIcon icon={faListAlt} color="white" />
      </button>

      <button
        onClick={toggleBookFeatureState}
        className={`book-recommender-feature-button ${
          isBookFeature ? "book-feature-active" : "book-feature-inactive"
        }`}
      >
        <FontAwesomeIcon icon={faBookmark} color="white" />
      </button>

      <button 
          onClick={toggleQuizFeatureState}
          className={`quiz-me-feature-button ${
              isQuizFeature ? "Quiz-feature-active" : "Quiz-feature-inactive"
          }`}
      >
        <FontAwesomeIcon icon={faBrain} color="white" />
      </button>

      <button
        className="onboarding-button"
        onClick={() => {
          console.log("Circle info button clicked");
          setRun(false);
          setTimeout(() => {
            setRun(true);
          }, 100);
        }}
      >
        <FontAwesomeIcon icon={faCircleInfo} color="white" />
      </button>
    </div>
  );
}
