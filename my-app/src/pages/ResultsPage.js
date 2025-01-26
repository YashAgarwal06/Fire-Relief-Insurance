import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContextStore } from '../lib/ContextStore';
import Header from './Header';

const ResultsPage = () => {
    const navigate = useNavigate();
    const insPollingRef = useRef(null);
    const amzPollingRef = useRef(null);

    const [insTaskStatus, setInsTaskStatus] = useState('PENDING');
    const [insTaskResult, setInsTaskResult] = useState(null);
    const [amznTaskStatus, setAmznTaskStatus] = useState('PENDING');
    const [amznTaskResult, setAmznTaskResult] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);

    const { ins_task_id, setins_task_id } = useContextStore();
    const { amzn_task_id, setamzn_task_id } = useContextStore();

    const pollEndpoint = async (task_id) => {
        if (!task_id) {
            setErrorMessage('Task ID is missing or invalid.');
            return;
        }
        try {
            const response = await fetch(`http://fire.bruinai.org:5000/task/${task_id}`);
            const data = await response.json();

            if (response.ok) {
                return data
            } else {
                setErrorMessage('Failed to fetch task status from the server.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while fetching task status.');
        }
    };

    useEffect(() => {
        const poll = () => {
            insPollingRef.current = setInterval(async () => {
                const data = await pollEndpoint(ins_task_id);

                setInsTaskStatus(data.state)

                if (data.state !== 'PENDING') {
                    clearInterval(insPollingRef.current);
                    setInsTaskResult(data.result)
                }
            }, 2000);
        };
        poll();
        return () => {
            clearInterval(insPollingRef.current);
        };
    }, []);

    useEffect(() => {
        const poll = () => {
            amzPollingRef.current = setInterval(async () => {
                const data = await pollEndpoint(amzn_task_id);

                setAmznTaskStatus(data.state)

                if (data.state !== 'PENDING') {
                    clearInterval(amzPollingRef.current);
                    setAmznTaskResult(data.result)
                }
            }, 2000);
        };
        poll();
        return () => {
            clearInterval(amzPollingRef.current)
        }
    }, []);

    return (
        <div>
            <Header></Header>
            <div className='results-main-cont'>
                <div className='results-top'>
                    <h2>Your Results:</h2>
                </div>
                <div className="results-container">
                {/* Render Insurance Column only when the status is SUCCESS */}
                {insTaskStatus === "SUCCESS" || "PENDING" && (
                    <div className="results-column insurance">
                        <h2>Insurance Task Result</h2>
                        <pre>{JSON.stringify(insTaskResult, null, 2)}</pre>
                    </div>
                )}

                {/* Render Amazon Column only when the status is SUCCESS */}
                {amznTaskStatus === "SUCCESS" || "PENDING" && (
                    <div className="results-column amazon">
                        <h2>Amazon Task Result</h2>

                        <pre>{JSON.stringify(amznTaskResult, null, 2)}</pre>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
