import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContextStore } from '../lib/ContextStore';
import config from '../config.json'
const BASE_URL = config.BACKEND_URL

const AmazonFileUpload = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    const { amzn_task_id, setamzn_task_id } = useContextStore();

    // when loading this component, set the amzn_task_id to empty
    useEffect(() => {
        setamzn_task_id('');
    }, [])

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                // Simulate file upload to the backend
                const response = await fetch(`${BASE_URL}/upload_amzn`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (response.ok) {
                    setamzn_task_id(data.task_id);
                } else {
                    alert(`Failed to upload file: ${data.error}`);
                    navigate('/');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('An error occurred. Please try again.');
                navigate('/');
            }
        }
    };
    const fileName = file?.name || "No file chosen";
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
            <div className="file-upload-row">
                <label className='file-upload-label'>
                    {"Your Orders: "}
                </label>
                <div className="file-upload-right">
                    <input
                        type="file"
                        accept='.zip'
                        onChange={handleFileChange}
                        className='file-upload-input'
                        id='file-upload-amzn'
                    />
                    <label htmlFor={'file-upload-amzn'} className="file-upload-custom">
                        Choose File
                    </label>
                    <span className="file-upload-name">{fileName}</span>
                </div>
            </div>
        </div>
    );
};

export default AmazonFileUpload;