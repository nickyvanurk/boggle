import React from 'react';

export default function FoundWordsWithScore({words, maxWords}) {
  const startIndex = Math.max(words.length - maxWords, 0);

  return (
    <div>
      {words.slice(startIndex, words.length).map(({word, score}, index) => {
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
