import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContextStore } from '../lib/ContextStore';
import config from '../config.json'
const BASE_URL = config.BACKEND_URL

const UploadInsurancePage = ({ docs }) => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    const { taskIds, setTaskIds } = useContextStore();

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
                    console.log(data.task_id);
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

    return (
        <div className='file-upload-container'>
            {docs.doc.map(doc => (
                <div key={doc.value} className="file-upload-row">
                    <label className='file-upload-label'>
                        {doc.label + ": "}
                    </label>
                    <input
                        type="file"
                        accept='.pdf'
                        onChange={(e) => handleFileChange(e, doc.endpoint)}
                        className='file-upload-input'
                    />
                </div>
            ))}
            <br />
        </div>

    );
};

export default UploadInsurancePage;