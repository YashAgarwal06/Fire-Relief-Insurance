import React from 'react';

// Assuming your spinner gif is in the src/assets folder
import spinnerGif from '../assets/splash.gif';

const Spinner = () => {
    return (
        <img src={spinnerGif} alt="Loading..." style={styles.spinner} />
    );
};

const styles = {
    spinner: {
        width: '158px',
        height: '158px',
        objectFit: 'contain', // Ensures the spinner keeps its aspect ratio
    },
};

export default Spinner;