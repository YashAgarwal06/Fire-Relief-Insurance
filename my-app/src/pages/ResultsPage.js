import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContextStore } from '../lib/ContextStore';

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [insTaskStatus, setInsTaskStatus] = useState('PENDING'); // Current state of the insurance task
    const [insTaskResult, setInsTaskResult] = useState(null); // Result of the insurance task
    const [amznTaskStatus, setAmznTaskStatus] = useState('PENDING'); // Current state of the amazon task
    const [amznTaskResult, setAmznTaskResult] = useState(null); // Result of the amazon task

    const [errorMessage, setErrorMessage] = useState(null); // Error message, if any

    const { ins_task_id, setins_task_id } = useContextStore();
    const { amzn_task_id, setamzn_task_id } = useContextStore();

    const fetchTaskStatus = async (task_id, setTaskStatus, setTaskResult) => {
        if (!task_id ) {
            setErrorMessage('Task ID is missing or invalid.');
            return;
        }
        try {
            const response = await fetch(`http://fire.bruinai.org:5000/task/${task_id}`);
            const data = await response.json();

            console.log(data);
            
            setTaskStatus(data.state);
            if (response.ok) {
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

    useEffect(() => {
        let ins_interval;
    
        if (insTaskStatus === 'PENDING' && ins_task_id) {
            ins_interval = setInterval(() => {
                fetchTaskStatus(ins_task_id, setInsTaskStatus, setInsTaskResult);
            }, 2000);
        }
    
        // Clear interval when task is no longer pending or component unmounts
        return () => {
            if (ins_interval) clearInterval(ins_interval);
        };
    }, [ins_task_id, insTaskStatus]);
    
    useEffect(() => {
        let amzn_interval;
    
        if (amznTaskStatus === 'PENDING' && amzn_task_id) {
            amzn_interval = setInterval(() => {
                fetchTaskStatus(amzn_task_id, setAmznTaskStatus, setAmznTaskResult);
            }, 2000);
        }
    
        // Clear interval when task is no longer pending or component unmounts
        return () => {
            if (amzn_interval) clearInterval(amzn_interval);
        };
    }, [amzn_task_id, amznTaskStatus]);
    
    return (
        <div>
            {insTaskStatus == "PENDING" && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold mb-4">Processing Insurance File...</h1>
                    <p className="text-lg mt-2">Task ID: {ins_task_id} {insTaskStatus}</p>
                    <p className="text-lg mt-4">Please wait while we process your file.</p>
                </div>
            )}
            {insTaskStatus == "SUCCESS" && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold text-green-500">Insurance File Processed Successfully!</h1>
                    <p className="text-lg mt-4">Task ID: {ins_task_id}</p>
                    <pre className="bg-gray-100 p-4 rounded mt-4 text-left">
                        {JSON.stringify(insTaskResult, null, 2)}
                    </pre>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Upload Another File
                    </button>
                </div>
            )}
            {insTaskStatus == 'FAILURE' && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold text-red-500">Insurance Task Failed</h1>
                    <p className="text-lg mt-4">{errorMessage || 'Something went wrong.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {amznTaskStatus == "PENDING" && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold mb-4">Processing Amazon File...</h1>
                    <p className="text-lg mt-2">Task ID: {amzn_task_id} {amznTaskStatus}</p>
                    <p className="text-lg mt-4">Please wait while we process your file.</p>
                </div>
            )}
            {amznTaskStatus == "SUCCESS" && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold text-green-500">Amazon File Processed Successfully!</h1>
                    <p className="text-lg mt-4">Task ID: {amzn_task_id}</p>
                    <pre className="bg-gray-100 p-4 rounded mt-4 text-left">
                        {JSON.stringify(amznTaskResult, null, 2)}
                    </pre>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Upload Another File
                    </button>
                </div>
            )}
            {amznTaskStatus == 'FAILURE' && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold text-red-500">Amazon Task Failed</h1>
                    <p className="text-lg mt-4">{errorMessage || 'Something went wrong.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    )
};

export default ResultsPage;