import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

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
            // Navigate to Loading Page
            navigate('/loading');

            // Simulate file upload to the backend
            const response = await fetch('http://fire.bruinai.org:5000/upload_hd', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/results', { state: { taskId: data.task_id } });
            } else {
                alert(`Failed to upload file: ${data.error}`);
                navigate('/');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred. Please try again.');
            navigate('/');
        }
    };

    return (
        <div>
            <h2>Upload File</h2>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
