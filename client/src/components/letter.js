import React from 'react';
import PropTypes from 'prop-types';

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

Letter.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};
