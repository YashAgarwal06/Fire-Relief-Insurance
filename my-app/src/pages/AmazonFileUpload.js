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
            navigate('/home');
        }
    };

    return (
        <div>
            <p className="upload-instructions">
                To download your Amazon Order History:
                <ol>
                    <li>
                        Log in to your <a href="http://amazon.com/" target="_blank" rel="noopener noreferrer">Amazon account</a>.
                    </li>
                    <li>
                        Visit <a href="https://www.amazon.com/hz/privacy-central/data-requests/preview.html" target="_blank" rel="noopener noreferrer">Amazon Privacy Central</a>, select "Your Orders" from the dropdown, and click "Submit Order."
                    </li>
                    <li>Follow Amazon's prompts to verify your request.</li>
                    <li>
                        When you receive Amazon's email, click "Download Data" to access the page, then download "Your Orders.zip." <br></br> <em>(Note: This may take a few hours.)</em>
                    </li>
                    <li>Upload "Your Orders.zip" below.</li>
                </ol>
            </p>
            <input type="file" accept=".zip" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default AmazonFileUpload;
