import React from 'react';

export default function HighScore({highscores, maxPlayers, onPlayAgainClick}) {
  return (
    <div>
      <h2>High Score</h2>

      {highscores.slice(0, maxPlayers)
                  .map(({playerName, score}, index) => {
        return (
          <div key={index} className="high-score-entry">
            <span className="player-name">{playerName}</span>
            <span className="player-score">{score}</span>
          </div>
        );
      })}

      <button onClick={onPlayAgainClick}>Play Again</button>
    </div>
  );
}
