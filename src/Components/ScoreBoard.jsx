import React from "react";
import "../App.css";

function Scoreboard({ currentScore, bestScore }) {
  return (
    <div className="scoreboard">
      <div className="score-item">
        <span className="score-label">Current Score{": "}</span>
        <span className="score-value current">{currentScore}</span>
      </div>
      <div className="score-divider"></div>
      <div className="score-item">
        <span className="score-label">Best Score{": "}</span>
        <span className="score-value best">{bestScore}</span>
      </div>
    </div>
  );
}

export default Scoreboard;
