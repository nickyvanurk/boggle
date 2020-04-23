import React from 'react';

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
