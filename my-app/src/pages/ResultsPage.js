import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { taskId } = location.state || {}; // Task ID passed from the previous page

    const [taskStatus, setTaskStatus] = useState('PENDING'); // Current state of the task
    const [taskResult, setTaskResult] = useState(null); // Result of the task
    const [errorMessage, setErrorMessage] = useState(null); // Error message, if any

    useEffect(() => {
        if (!taskId) {
            setErrorMessage('No Task ID provided.');
            return;
        }

        const fetchTaskStatus = async () => {
            try {
                const response = await fetch(`http://fire.bruinai.org:5000/task/${taskId}`);
                const data = await response.json();

                if (response.ok) {
                    setTaskStatus(data.state);

                    if (data.state === 'SUCCESS') {
                        setTaskResult(data.result); // Store the result for display
                    } else if (data.state === 'FAILURE') {
                        setErrorMessage('Task failed to process.');
                    }
                } else {
                    setErrorMessage('Failed to fetch task status from the server.');
                }
            } catch (error) {
                setErrorMessage('An error occurred while fetching task status.');
            }
        };

        // Poll every 2 seconds while the task is pending
        const interval = setInterval(() => {
            if (taskStatus === 'PENDING') {
                fetchTaskStatus();
            } else {
                clearInterval(interval); // Stop polling when task is no longer pending
            }
        }, 2000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [taskId, taskStatus]);

    // Handle no task ID error
    if (!taskId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p className="text-lg mt-4">{errorMessage}</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Handle loading state
    if (taskStatus === 'PENDING') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Processing...</h1>
                <p className="text-lg mt-2">Task ID: {taskId}</p>
                <p className="text-lg mt-4">Please wait while we process your file.</p>
            </div>
        );
    }

    // Handle success state
    if (taskStatus === 'SUCCESS') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-green-500">File Processed Successfully!</h1>
                <p className="text-lg mt-4">Task ID: {taskId}</p>
                <pre className="bg-gray-100 p-4 rounded mt-4 text-left">
                    {JSON.stringify(taskResult, null, 2)}
                </pre>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Upload Another File
                </button>
            </div>
        );
    }

    // Handle failure state
    if (taskStatus === 'FAILURE') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-500">Task Failed</h1>
                <p className="text-lg mt-4">{errorMessage || 'Something went wrong.'}</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return null;
};

export default ResultsPage;
