import React from 'react';

export default function Square(props) {
  const {isSelected, onMouseDown, onMouseEnter, value} = props;

  return (
    <button className={`square ${isSelected ? 'selected' : ''}`}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}>
      {value}
    </button>
  );
}
