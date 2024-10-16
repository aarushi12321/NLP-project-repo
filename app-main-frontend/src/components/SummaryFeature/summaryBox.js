import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./summaryFeature.css";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export function SummaryBox({ isSummaryFeature, toggleSummaryFeatureState }) {
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
      <p>
        Add Summary Feature Cards that open up to give summary in different
        contexts like Word count, cloud etc.
      </p>
    </div>
  );
}
