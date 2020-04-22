import React from 'react';

export default function FoundWordsWithScore(props) {
  return (
    <div>
      {props.words.map(({word, score}, index) => {
        return (
          <div key={index}>
            <span>{word}</span>
            <span>{score}</span>
          </div>
        );
      })}
    </div>
  );
}
