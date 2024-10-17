import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./summaryFeature.css";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { SummaryCard } from "./summaryCard";
import { useState } from "react";

export function SummaryBox({ isSummaryFeature, toggleSummaryFeatureState }) {
  const cards = [
    { id: 1, title: "Word Count Summary" },
    { id: 2, title: "Word Cloud Summary" },
    { id: 3, title: "Another Summary" },
  ];

  const [expandedCard, setExpandedCard] = useState(null);
  const [noExpanded, setNoExpanded] = useState(true);

  const handleCardClick = (cardId) => {
    setExpandedCard(cardId === expandedCard ? null : cardId);
    setNoExpanded(!noExpanded);
  };

  return (
    <div
      className={`summary-outer-box ${
        isSummaryFeature ? "feature-active-summary" : "feature-inactive-summary"
      }`}
    >
      <button
        className={`close-summary-feature-button ${
          isSummaryFeature
            ? "feature-active-summary"
            : "feature-inactive-summary"
        }`}
        onClick={toggleSummaryFeatureState}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
      <span className="summary-heading">LET'S SUMMARIZE!</span>
      <div className="summary-card-outer-box">
        <SummaryCard
          title="Word Count Summary"
          content="This is a detailed word count summary..."
          isExpanded={expandedCard === 1}
          onExpand={() => handleCardClick(1)}
          onClose={() => handleCardClick(1)}
          noExpanded={noExpanded}
        />

        <SummaryCard
          title="Word Count Summary"
          content="This is a detailed word count summary..."
          isExpanded={expandedCard === 2}
          onExpand={() => handleCardClick(2)}
          onClose={() => handleCardClick(2)}
          noExpanded={noExpanded}
        />

        <SummaryCard
          title="Word Count Summary"
          content="This is a detailed word count summary..."
          isExpanded={expandedCard === 3}
          onExpand={() => handleCardClick(3)}
          onClose={() => handleCardClick(3)}
          noExpanded={noExpanded}
        />

        <SummaryCard
          title="Word Count Summary"
          content="This is a detailed word count summary..."
          isExpanded={expandedCard === 4}
          onExpand={() => handleCardClick(4)}
          onClose={() => handleCardClick(4)}
          noExpanded={noExpanded}
        />
        <SummaryCard
          title="Word Count Summary"
          content="This is a detailed word count summary..."
          isExpanded={expandedCard === 5}
          onExpand={() => handleCardClick(5)}
          onClose={() => handleCardClick(5)}
          noExpanded={noExpanded}
        />
        <SummaryCard
          title="Word Count Summary"
          content="This is a detailed word count summary..."
          isExpanded={expandedCard === 6}
          onExpand={() => handleCardClick(6)}
          onClose={() => handleCardClick(6)}
          noExpanded={noExpanded}
        />
      </div>
    </div>
  );
}
