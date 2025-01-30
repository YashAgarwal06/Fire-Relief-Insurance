import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContextStore } from '../lib/ContextStore';
import config from '../config.json'
const BASE_URL = config.BACKEND_URL

const UploadInsurancePage = ({ docs, fileInputs, setFileInputs }) => {
    const navigate = useNavigate(); // Hook for navigation

    const handleFileChange = (e, value) => {
        const newFileInputs = fileInputs.map(input =>
            input.value === value ? { ...input, file: e.target.files[0] } : input
        );
        setFileInputs(newFileInputs);
    };

    const eeeee = async (e) => {
        const selectedFile = e.target.files[0];

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
            {docs?.doc?.map(doc => {
                const fileInput = fileInputs.find(input => input.value === doc.value);
                const fileName = fileInput?.file?.name || "No file chosen";

                return (
                    <div key={doc.value} className="file-upload-row">
                        <label className='file-upload-label'>
                            {doc.label + ": "}
                        </label>
                        <div className="file-upload-right">
                            <input
                                type="file"
                                accept='.pdf'
                                onChange={(e) => handleFileChange(e, doc.value)}
                                className='file-upload-input'
                                id={`file-upload-${doc.value}`}
                            />
                            <label htmlFor={`file-upload-${doc.value}`} className="file-upload-custom">
                                Choose File
                            </label>
                            <span className="file-upload-name">{fileName}</span>
                        </div>
                    </div>
                );
            })}
            <br />
        </div>
    );
};

export default UploadInsurancePage;