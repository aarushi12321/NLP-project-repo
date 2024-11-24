import React from "react";
import "./SettingsMenu.css";

export function SettingsMenu({ isExpanded, optionLength, setOptionLength, responseType, setResponseType }) {
  const handleChangeInOptionLength = (e) => {
    setOptionLength(Number(e.target.value));
  };

  const handleChangeInResponseType = (e) => {
    setResponseType(e.target.value);
  };

  const getOptionLengthLabel = (value) => {
    if (value === 1) return "Small";
    if (value === 2) return "Medium";
    if (value === 3) return "Large";
  };

  return (
    <div className={`settings-menu ${isExpanded ? "expanded-settings" : ""}`}>
      <div className="settings-container">
        <div className="setting">
          <label htmlFor="option-length" className="header-label">
            Length
          </label>
          <input
            type="range"
            id="option-length"
            min="1"
            max="3"
            step="1"
            value={optionLength}
            onChange={handleChangeInOptionLength}
          />
          <span>{getOptionLengthLabel(optionLength)}</span>
        </div>

        <div className="setting">
          <label className="header-label">Response Type</label>
          <div>
            <label>
              <input
                type="radio"
                value="descriptive"
                checked={responseType === "descriptive"}
                onChange={handleChangeInResponseType}
              />
              Descriptive
            </label>
            <label>
              <input
                type="radio"
                value="bullet"
                checked={responseType === "bullet"}
                onChange={handleChangeInResponseType}
              />
              Points
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}