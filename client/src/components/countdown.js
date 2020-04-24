import React from 'react';
import PropTypes from 'prop-types';

export default function Countdown({seconds, minutes}) {
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return (
    <div>
      <span>{minutes}</span>:
      <span>{seconds}</span>
    </div>
  );
}

Countdown.propTypes = {
  seconds: PropTypes.number.isRequired,
  minutes: PropTypes.number.isRequired
};
