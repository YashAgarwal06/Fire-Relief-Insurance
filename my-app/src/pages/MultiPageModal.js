import React, { useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SelectDocuments from './SelectDocumentsPage';
import UploadInsurancePage from './UploadInsurancePage';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '600px',
    minHeight: '400px',
    backgroundColor: 'white',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    maxHeight: '90vh',
};

const MultiPageModal = ({ isModalOpen, setIsModalOpen }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [docs, setDocs] = useState([]);

    const handleStartUpload = () => {
        if (docs.length === 0) {
            alert('Please select at least one document to upload.');
            return;
        }
        setCurrentStep(1);
    };

    const handleNext = () => {
        if (currentStep < docs.length) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setDocs([]);
        setCurrentStep(0);
    };

    const handleSubmit = () => {
        alert('All files uploaded successfully!');
        setIsModalOpen(false);
    };

    const currentDoc = docs[currentStep - 1];

    console.log('Current Step:', currentStep);
    console.log('Docs:', docs);
    console.log('Current Doc:', currentDoc);


    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        color: '#000',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {currentStep === 0 ? (
                    <SelectDocuments
                        docs={docs}
                        setDocs={setDocs}
                        onStartUpload={handleStartUpload}
                    />
                ) : (
                    currentDoc && (
                        <UploadInsurancePage
                            doc={currentDoc}
                            onNext={handleNext}
                            isLast={currentStep === docs.length}
                            onSubmit={handleSubmit}
                        />
                    )
                )}
            </Box>
        </Modal>
    );
};

export default MultiPageModal;
