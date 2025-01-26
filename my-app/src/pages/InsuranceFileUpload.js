import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContextStore } from '../lib/ContextStore';

const InsuranceFileUpload = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate(); // Hook for navigation
    const [taskId, setTaskId] = useState(null); // State to store taskId
    const { ins_task_id, setins_task_id } = useContextStore();

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
            const response = await fetch('http://fire.bruinai.org:5000/upload_hd', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setins_task_id(data.task_id)
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
                Upload any document related to your Home Insurance Policy:
                <ul className="list-disc pl-5">
                    <li>Insurance Policy</li>
                    <li>Insurance Renewal</li>
                    <li>Insurance Declarations</li>
                    <li>Insurance Claims</li>
                </ul>
                The file must be uploaded in PDF format.
            </p>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default InsuranceFileUpload;
