import React from 'react';

// Assuming your spinner gif is in the src/assets folder
import spinnerGif from '../assets/splash.gif';

const Spinner = () => {
    return (
        <div style={styles.spinnerContainer}>
            <img src={spinnerGif} alt="Loading..." style={styles.spinner} />
        </div>
    );
};

const styles = {
    spinnerContainer: {
        width: '100%', // Spinner container takes full width of the parent
        height: '100%', // Spinner container takes full height of the parent
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinner: {
        width: '100%', // Spinner image fits container width
        height: '100%', // Spinner image fits container height
        objectFit: 'contain', // Ensures the spinner keeps its aspect ratio
    },
};

export default Spinner;