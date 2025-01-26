import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <h1 className="text-4xl font-bold text-white mb-8">Uploading...</h1>
            <CircularProgress size={80} thickness={5} />
        </div>
    );
};

export default LoadingPage;
