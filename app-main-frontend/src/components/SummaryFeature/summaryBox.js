import "./summaryFeature.css";

export function SummaryBox({ isSummaryFeature }) {
  return (
    <div
      className={`summary-outer-box ${
        isSummaryFeature ? "feature-active-summary" : "feature-inactive-summary"
      }`}
    >
      <p>
        Add Summary Feature Cards that open up to give summary in different
        contexts like Word count, cloud etc.
      </p>
    </div>
  );
}
