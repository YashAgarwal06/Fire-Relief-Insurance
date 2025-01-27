import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContextStore } from '../lib/ContextStore';
import config from '../config.json'
const BASE_URL = config.BACKEND_URL

const InsuranceFileUpload = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate(); // Hook for navigation
    const { ins_task_id, setins_task_id } = useContextStore();

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                // Simulate file upload to the backend
                const response = await fetch(`${BASE_URL}/upload_hd`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (response.ok) {
                    setins_task_id(data.task_id);
                    alert('File uploaded successfully! Task ID: ' + data.task_id);
                } else {
                    alert(`Failed to upload file: ${data.error}`);
                    navigate('/home');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('An error occurred. Please try again.');
                navigate('/home');
            }
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
             <input type="file" id = 'browse' accept=".pdf" onChange={handleFileChange} />
        </div>
    );
};

export default InsuranceFileUpload;
