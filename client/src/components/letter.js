import React from 'react';

export default function Letter(props) {
  const {isSelected, onMouseDown, onMouseEnter, value} = props;

  return (
    <button className={`letter ${isSelected ? 'selected' : ''}`}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}>
      {value}
    </button>
  );
}
