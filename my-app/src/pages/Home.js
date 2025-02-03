import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SelectDocuments from './SelectDocumentsPage';
import UploadInsurancePage from './UploadInsurancePage';
import '../CoverClear.css';
import Footer from '../lib/Footer';
import './Home.css';

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

// Header Component
const Header = ({ onOpenModal }) => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-content">
                <span className="logo">LOGO</span>
                <nav>
                    <a href="#about" className="nav-link">About</a>
                    <button className="get-started-button" onClick={onOpenModal}>Get Started</button>
                </nav>
            </div>
        </header>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [docs, setDocs] = useState([]);
    const [currentDocIndex, setCurrentDocIndex] = useState(-1);
    const [fileInputs, setFileInputs] = useState([]);

    const handleStartUpload = () => {
        if (docs.length === 0) {
            alert('Please select at least one document to upload.');
            return;
        }
        const initialFileInputs = docs.map((doc) => ({
            type: doc,
            files: { declaration: null, renewal: null },
        }));
        setFileInputs(initialFileInputs);
        setCurrentDocIndex(0);
    };

    const handleNext = () => {
        if (currentDocIndex < docs.length - 1) {
            setCurrentDocIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDocs([]);
        setFileInputs([]);
        setCurrentDocIndex(-1);
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
        console.log('Submitting files:', fileInputs);
        navigate('/results');
    };

    return (
        <div>
            <Header onOpenModal={() => setIsModalOpen(true)} />
            <main className="home-page-main">
                <div className="home-page-gradient"></div>
                <div className="home-page-image-gradient"></div>

                <div className="home-page-text">
                    <h1 className="home-page-title">janus</h1>
                    <p className="home-page-description">
                        This is the description about the product.
                    </p>
                    <Button
                        className="home-page-button"
                        variant="contained"
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            backgroundColor: '#3D2E43',
                            color: 'white',
                            padding: '12px 30px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        Get Started
                    </Button>
                </div>
            </main>

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
                            onSubmit={handleSubmitAll}
                            fileInputs={fileInputs}
                        />
                    )}
                </Box>
            </Modal>
            <Footer />
        </div>
    );
};

export default Home;
