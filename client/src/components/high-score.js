import React from 'react';

export default function HighScore(props) {
  const {
    highscores,
    maxPlayers,
    onPlayBoardClick,
    onPlayAgainClick
  } = props;

  return (
    <div>
      <h2>High Score</h2>

      {highscores.slice(0, maxPlayers)
                  .map(({boardId, playerName, score}, index) => {
        return (
          <div key={index} className="high-score-entry">
            <span className="player-name">{playerName}</span>
            <span className="player-score">{score}</span>
            <svg id={boardId} className="player-play-board" onClick={onPlayBoardClick} height="20" viewBox="0 0 300 300" width="20" xmlns="http://www.w3.org/2000/svg"><g><circle cx="162.001" cy="146" fill="#efefd2" r="92"/><g fill="#4c241d"><path d="m226.001 82c-8.824 0-16-7.178-16-16s7.176-16 16-16 16 7.178 16 16-7.176 16-16 16zm0-24c-4.41 0-8 3.588-8 8s3.59 8 8 8 8-3.588 8-8-3.59-8-8-8z"/><circle cx="192.001" cy="64" r="4.529"/><circle cx="228.001" cy="96" r="4.529"/></g><g><path d="m50.001 46v208l100-104z" fill="#e66353"/><path d="m50.001 258c-.504 0-1.012-.094-1.496-.289-1.512-.611-2.504-2.078-2.504-3.711v-208c0-1.633.992-3.1 2.504-3.711 1.512-.605 3.246-.238 4.379.939l100 104c1.488 1.547 1.488 3.996 0 5.543l-100 104c-.77.801-1.817 1.229-2.883 1.229zm4-202.068v188.137l90.449-94.069z" fill="#4c241d"/></g><g><path d="m50.001 46 68 104h112z" fill="#ffce56"/><path d="m230.001 154h-112c-1.352 0-2.609-.682-3.348-1.811l-68-104c-1.016-1.551-.832-3.594.441-4.939 1.273-1.35 3.305-1.637 4.906-.713l180 104c1.57.904 2.332 2.75 1.863 4.498-.468 1.75-2.054 2.965-3.862 2.965zm-109.836-8h94.918l-152.547-88.139z" fill="#4c241d"/></g><g><path d="m50.001 254 68-104h112z" fill="#a9ba5a"/><path d="m50.001 258c-1.07 0-2.129-.43-2.906-1.25-1.273-1.346-1.457-3.389-.441-4.939l68-104c.738-1.129 1.996-1.811 3.348-1.811h112c1.809 0 3.395 1.215 3.863 2.965.469 1.748-.293 3.594-1.863 4.498l-180 104c-.626.361-1.314.537-2.001.537zm70.164-104-57.629 88.139 152.547-88.139z" fill="#4c241d"/></g></g></svg>
          </div>
        );
      })}

      <button onClick={onPlayAgainClick}>Play Again</button>
    </div>
  );
}
