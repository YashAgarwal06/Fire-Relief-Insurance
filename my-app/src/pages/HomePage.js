import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from './InsuranceFileUpload';
import config from '../config.json'
const BASE_URL = config.BACKEND_URL

const HomePage = () => {
    const navigate = useNavigate();

    const handleFileUpload = async (file) => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Navigate to Loading Page
            navigate('/loading');

            // Simulate file upload to the Flask backend
            const response = await fetch(`${BASE_URL}/upload_hd`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                // Navigate to Results Page with task ID
                navigate('/results', { state: { taskId: data.task_id } });
            } else {
                alert(`File upload failed: ${data.error}`);
                navigate('/'); // Redirect back to home on error
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An unexpected error occurred.');
            navigate('/'); // Redirect back to home on error
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Upload Your File</h1>
            <FileUpload onUpload={handleFileUpload} />
        </div>
    );
};

export default HomePage;
