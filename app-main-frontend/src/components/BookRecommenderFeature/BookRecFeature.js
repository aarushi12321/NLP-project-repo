import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./BookFeature.css";

export function BookRecfeature({ isBookfeature, toggleBookFeatureState }) {
  return (
    <div
      className={`book-feature-outer-box ${
        isBookfeature ? "feature-active-book" : "feature-inactive-book"
      }`}
    >
      <button
        className={`close-book-feature-button ${
          isBookfeature ? "feature-active-book" : "feature-inactive-book"
        }`}
        onClick={toggleBookFeatureState}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
}
