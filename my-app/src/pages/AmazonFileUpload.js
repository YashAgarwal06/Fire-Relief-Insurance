import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContextStore } from '../lib/ContextStore';

const AmazonFileUpload = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    const { amzn_task_id, setamzn_task_id } = useContextStore();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // // Navigate to Loading Page
            // navigate('/loading');

            // Simulate file upload to the backend
            const response = await fetch('http://fire.bruinai.org:5000/upload_amzn', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setamzn_task_id(data.task_id)
                alert('File uploaded successfully! Task ID: ' + data.task_id);
            } else {
                alert(`Failed to upload file: ${data.error}`);
                // navigate('/');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred. Please try again.');
            navigate('/');
        }
    };

    return (
        <div>
            {/* <h2>Upload Insurance Policy</h2> */}
            <input type="file" accept=".zip" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default AmazonFileUpload;
