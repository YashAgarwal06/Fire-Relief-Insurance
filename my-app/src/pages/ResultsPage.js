import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContextStore } from '../lib/ContextStore';
import Header from './Header';
import config from '../config.json'
const BASE_URL = config.BACKEND_URL

// https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

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
            const response = await fetch(`${BASE_URL}/task/${task_id}`);
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

                if (data) {
                    await setInsTaskStatus(data.state)

                    if (data.state !== 'PENDING') {
                        clearInterval(insPollingRef.current);
                        setInsTaskResult(data.result)
                    }
                }
                else {
                    clearInterval(insPollingRef.current);
                }

            }, 2000);
        };
        if (ins_task_id)
            poll();
        return () => {
            clearInterval(insPollingRef.current);
        };
    }, []);

    useEffect(() => {
        const poll = () => {
            amzPollingRef.current = setInterval(async () => {
                const data = await pollEndpoint(amzn_task_id);

                if (data) {
                    await setAmznTaskStatus(data.state)

                    if (data.state !== 'PENDING') {
                        clearInterval(amzPollingRef.current);

                        if (data.state === 'SUCCESS') {
                            // this following code converts the base64 string representing an excel file to a downloadable file
                            const blob = b64toBlob(data.result, null);
                            const blobUrl = URL.createObjectURL(blob);

                            let a = document.createElement('a');
                            a.href = blobUrl;
                            a.download = 'data.xlsx'; // set file name
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                        }
                    }
                }
                else {
                    clearInterval(amzPollingRef.current)
                }
            }, 2000);
        };

        if (amzn_task_id)
            poll();
        return () => {
            clearInterval(amzPollingRef.current)
        }
    }, []);

    return (
        <div>
            <Header></Header>
            <div className='results-main-cont'>
                <div className="results-top">
                    <h2 className="your-results-heading">Your Results:</h2>
                    <p className="results-description">
                        Below are the results of your tasks. Please check the detailed information from both the Insurance and Amazon results.
                    </p>
                </div>
                <div className="results-container">
                    {/* Render Insurance Column only when the status is SUCCESS */}
                    {(insTaskStatus === "SUCCESS" || insTaskStatus === "PENDING") && (
                        <div className="results-column insurance">
                            <h2>Insurance Coverage Summary</h2>
                            <pre>{JSON.stringify(insTaskResult, null, 2)}</pre>
                        </div>
                    )}

                    {/* Render Amazon Column only when the status is SUCCESS */}
                    {(amznTaskStatus === "SUCCESS" || amznTaskStatus === "PENDING") && (
                        <div className="results-column amazon">
                            <h2 id='amazon-result'>Item Inventory</h2>
                            <button className='button'>Download</button>

                            <pre>{JSON.stringify(amznTaskResult, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
