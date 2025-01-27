import React from 'react';

// Assuming your spinner gif is in the src/assets folder
import spinnerGif from '../assets/splash.gif';

const Spinner = ({ size = 40 }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src={spinnerGif}
        alt="Loading..."
        style={{ width: `${size}px`, height: `${size}px` }} // Dynamically set size
      />
    </div>
  );
};

export default Spinner;