import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export function SummaryCard({
  title,
  content,
  isExpanded,
  onExpand,
  onClose,
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
        <h3>{title}</h3>
        {isExpanded && (
          <>
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
  );
}
