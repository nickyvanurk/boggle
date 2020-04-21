import React from 'react';

export default function Square(props) {
  return (
    <button className={`square ${props.isSelected ? 'selected' : ''}`}
            onMouseDown={props.onMouseDown}
            onMouseEnter={props.onMouseEnter}>
      {props.value}
    </button>
  );
}
