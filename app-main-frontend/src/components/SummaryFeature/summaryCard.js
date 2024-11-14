import React from "react";
import { CircularWordCloud } from "./circularwordcloud";

export function SummaryCard({
  title,
  content,
  isExpanded,
  onExpand,
  onClose,
  wordCloud,
  noExpanded,
}) {
  return (
    <div
      className={`summary-card ${
        isExpanded ? "expanded-card" : "collapsed-card"
      } ${noExpanded ? "visible-card" : "no-visible-card"}`}
      onClick={onExpand}
    >
      <div className="card-content">
        <h3 className="summary-title">{title}</h3>
        <div className="card-content-summary">
          {isExpanded && (
            <>
              <div className="wordcloud-container">
                <CircularWordCloud wordCloud={wordCloud} />
              </div>
              <p>{content}</p>
              <button
                className="close-card-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                Go Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
