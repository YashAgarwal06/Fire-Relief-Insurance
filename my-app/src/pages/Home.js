import React, { useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import FileUpload from './FileUpload';
import '../CoverClear.css';
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    padding: '16px',
    borderRadius: '8px',
};
const CoverClear = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleGetStartedClick = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="coverclear-container">
            <div className="coverclear-content">
                <h1 className="coverclear-title">CoverClear</h1>
                <p className="coverclear-description">
                    Insurance claimants affected by the January California Wildfires are attempting to submit itemized claims for household items lost in the fires. However, many claimants don’t know exactly what was in their home, as they were unable to evacuate their property. It’s also difficult to create an itemized list without reviewing years of receipts.
                </p>
                <div className="coverclear-checklist">
                    <h2>Checklist for Gathering Information:</h2>
                    <ul>
                        <li>Insurance Policy</li>
                        <li>Bank Statements</li>
                        <li>Amazon Order History</li>
                        <li>Gmail Emails (e.g., receipts)</li>
                    </ul>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGetStartedClick}
                    className="get-started-button"
                >
                    Get Started
                </Button>
            </div>
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2" textAlign="center">
                        Upload File
                    </Typography>
                    <Box mt={4}>
                        <FileUpload />
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        fullWidth
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};
export default CoverClear;