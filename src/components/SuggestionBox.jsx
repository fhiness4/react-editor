import React from 'react';
import './SuggestionBox.css';

const SuggestionBox = ({ suggestions, onApplySuggestion, onClose }) => {
  return (
    <div className="suggestion-overlay">
      <div className="suggestion-box">
        <div className="suggestion-header">
          <h3>💡 Code Suggestions</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="suggestions-container">
          {Object.entries(suggestions).map(([lang, items]) => (
            <div key={lang} className="suggestion-section">
              <h4>{lang.toUpperCase()}</h4>
              <div className="suggestion-list">
                {items.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => onApplySuggestion(lang, suggestion)}
                  >
                    <span className="suggestion-icon">→</span>
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestionBox;