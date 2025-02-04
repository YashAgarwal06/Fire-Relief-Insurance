import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown'
import { useContextStore } from '../lib/ContextStore';
import Header from '../lib/Header';
import Spinner from '../lib/Spinner'

const { BACKEND_URL } = require('../config.json')

const ResultsPage = () => {
    const [status, setStatus] = useState('PENDING');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const { ins_task_id, setins_task_id } = useContextStore();

    useEffect(() => {
        let isMounted = true; // To avoid state updates after component unmounts

        const pollEndpoint = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/task/${ins_task_id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();

                if (isMounted) {
                    if (result.state === 'SUCCESS') {
                        setStatus('SUCCESS');
                        setData(result.result);
                    } else {
                        // If not successful, poll again after a delay
                        setTimeout(pollEndpoint, 2000); // Poll every 2 seconds
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setStatus('ERROR');
                }
            }
        };

        pollEndpoint(); // Start polling on component mount

        return () => {
            isMounted = false; // Cleanup to prevent state updates after unmount
        };
    }, []);

    return (
        <div>
            <Header />
            <div className='results-main-cont'>
                <div className="results-top">
                    <h2 className="your-results-heading">Your Results:</h2>
                    <p className="results-description">
                        Below are the results of your tasks. Please check the detailed information from both the Insurance and Amazon results.
                    </p>
                </div>
                <div className="results-container">
                    {(status === 'PENDING') && (
                        <div className='spinner'>
                            <Spinner />
                            <p>Loading...</p>
                        </div>
                    )}
                    {(status === "SUCCESS") && (
                        <div className="results-insurance">
                            <h1>Insurance Coverage Summary</h1>
                            <Markdown>{data}</Markdown>
                            <br />
                            <br />
                        </div>
                    )}
                    {(status === "ERROR") && (
                        <div>Error: {error}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
