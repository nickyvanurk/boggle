import React from 'react';

export default function FoundWordsWithScore(props) {
  return (
    <div>
      {props.words.map(({word, score}, index) => {
        return (
          <div key={index}>
            <span className="found-words-word">{word}</span>
            <span className="found-words-score">{score}</span>
          </div>
        );
      })}
    </div>
  );
}
