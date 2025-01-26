import React, { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState(null);

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
            const response = await fetch('http://localhost:5000/upload_hd', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert(`File uploaded successfully! Task ID: ${data.task_id}`);
            } else {
                alert(`Failed to upload file: ${data.error}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred. Please try again.');
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
