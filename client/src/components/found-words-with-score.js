import React from 'react';
import PropTypes from 'prop-types';

export default function FoundWordsWithScore({words, maxWords}) {
  return (
    <div>
      {words.slice(Math.max(words.length - maxWords, 0), words.length)
            .map(({word, score}, index) => {
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

FoundWordsWithScore.propTypes = {
  words: PropTypes.arrayOf(PropTypes.object).isRequired,
  maxWords: PropTypes.number.isRequired
};
