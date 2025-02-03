import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation to the results page
import SelectDocuments from './SelectDocumentsPage';
import UploadInsurancePage from './UploadInsurancePage';
import '../CoverClear.css';
import Header from '../lib/Header';
import homePageImage from '../assets/homepageimage.png';

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
    overflowY: 'auto',
};

const Home = () => {
    const navigate = useNavigate(); // For navigation to the results page
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [docs, setDocs] = useState([]);
    const [currentDocIndex, setCurrentDocIndex] = useState(-1);
    const [fileInputs, setFileInputs] = useState([]);

    const handleStartUpload = () => {
        if (docs.length === 0) {
            alert('Please select at least one document to upload.');
            return;
        }
        // Initialize file inputs for the selected documents
        const initialFileInputs = docs.map((doc) => ({
            type: doc,
            files: { declaration: null, renewal: null },
        }));
        setFileInputs(initialFileInputs);
        setCurrentDocIndex(0); // Move to the first document's upload page
    };

    const handleNext = () => {
        if (currentDocIndex < docs.length - 1) {
            setCurrentDocIndex((prevIndex) => prevIndex + 1); // Go to the next document
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDocs([]);
        setFileInputs([]);
        setCurrentDocIndex(-1); // Reset the flow
    };

    const handleFileUpload = (docType, fileType, file) => {
        const updatedFileInputs = fileInputs.map((input) =>
            input.type === docType
                ? { ...input, files: { ...input.files, [fileType]: file } }
                : input
        );
        setFileInputs(updatedFileInputs);
    };

    const handleSubmitAll = () => {
        // Log or process the uploaded files
        console.log('Submitting files:', fileInputs);

        // Redirect to the results page
        navigate('/results');
    };

    return (
        <div>
            <Header />
            <div style={{ textAlign: 'center', marginTop: '80px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#262b2f' }}>
                    Restoring Hope & Stability for Wildfire Survivors
                </h1>
                <p
                    style={{
                        fontSize: '1rem',
                        color: '#555',
                        margin: '40px auto',
                        maxWidth: '850px',
                        lineHeight: '1.6',
                    }}
                >
                    Insurance claimants affected by the January California Wildfires are attempting
                    to submit itemized claims for household items lost in the fires. However, many claimants don't
                    know exactly what was in their home, as they were unable to evacuate their property. It's also
                    difficult to create an itemized list without reviewing years of receipts.
                </p>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <Button
                    variant="contained"
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        backgroundColor: '#ff6b35',
                        color: 'white',
                        padding: '12px 30px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                    }}
                >
                    Get Started
                </Button>
            </div>
            <div
                style={{
                    display: 'flex',
                    backgroundColor: '#1f4d61',
                    height: '350px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '40px -20px',
                }}
            >
                <div style={{ flex: 1, backgroundColor: 'blue' }}></div>
                <div
                    style={{
                        flex: 1,
                        backgroundColor: '#4C6778',
                        display: 'flex',
                        alignItems: 'flex-start',
                        height: '350px',
                    }}
                >
                    <img
                        src={homePageImage}
                        alt="Image"
                        style={{
                            objectFit: 'contain',
                            height: 'auto',
                            width: '100%',
                            verticalAlign: 'top',
                        }}
                    />
                </div>
                <div
                    style={{
                        flex: 1,
                        backgroundColor: '#4C6778',
                        color: 'white',
                        minHeight: '350px',
                        maxHeight: '300px',
                        paddingLeft: '20px',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <p
                        style={{
                            marginBottom: '5px',
                            padding: '10px',
                            marginTop: '20px',
                            fontWeight: 'bold',
                        }}
                    >
                        1. Upload Your Home Insurance Risk Assessment
                    </p>
                    <ol
                        style={{
                            listStyleType: 'none',
                            paddingLeft: '10px',
                            maxWidth: '800px',
                            margin: '0 auto',
                        }}
                    >
                        <li>
                            <ul
                                style={{
                                    listStyleType: 'none',
                                    paddingLeft: '20px',
                                    marginTop: '5px',
                                }}
                            >
                                <li style={{ marginBottom: '4px' }}>• Your Personal Risk Diagnostic</li>
                                <li style={{ marginBottom: '4px' }}>• Areas Of High Exposure</li>
                                <li>• Tangible Steps to Mitigate Your Risk</li>
                            </ul>
                        </li>
                    </ol>
                </div>
                <div style={{ flex: 1 }}></div>
            </div>
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    {currentDocIndex === -1 ? (
                        <SelectDocuments docs={docs} setDocs={setDocs} onStartUpload={handleStartUpload} />
                    ) : (
                        <UploadInsurancePage
                            doc={docs[currentDocIndex]}
                            onNext={handleNext}
                            isLast={currentDocIndex === docs.length - 1}
                            onFileUpload={handleFileUpload}
                            onSubmit={handleSubmitAll} // Pass handleSubmitAll
                            fileInputs={fileInputs} // Pass all file inputs for context
                        />
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default Home;
