import React, { useState } from 'react';
import { Modal, Box, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import SelectDocuments from './SelectDocumentsPage';
import UploadInsurancePage from './UploadInsurancePage';
import UserDetailsPage from './UserDetailsPage';
import '../CoverClear.css';
import Header from '../lib/Header';
import Footer from '../lib/Footer';
import { useContextStore } from '../lib/ContextStore';
import "./Home.css";


const { BACKEND_URL } = require('../config.json')

const Home = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [docs, setDocs] = useState([]);
    const [currentDocIndex, setCurrentDocIndex] = useState(-1);
    const [fileInputs, setFileInputs] = useState([]);

    const [age, setAge] = useState('');
    const [hasSpouse, setHasSpouse] = useState(false);
    const [dependents, setDependents] = useState('');

    const { ins_task_id, setins_task_id } = useContextStore();

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        minHeight: currentDocIndex === -1 ? '330px' : '300px',
        backgroundColor: 'white',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '20px',
        transition: 'min-height 0.3s ease-in-out',
    };

    const handleStartUpload = () => {
        if (docs.length === 0) {
            alert('Please select at least one document to upload.');
            return;
        }
        const initialFileInputs = docs.map((doc) => ({
            type: doc,
            files: { declaration: null },
        }));
        setFileInputs(initialFileInputs);
        setCurrentDocIndex(0);
    };

    const handleNext = () => {
        if (currentDocIndex < docs.length) {
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

    const handleSubmitAll = async () => {
        const data = new FormData();
        fileInputs.forEach(fileInput => {
            data.append(`${fileInput.type.value}`, fileInput.files.declaration);
        });

        // Append user details
        data.append('age', age);
        data.append('hasSpouse', hasSpouse);
        data.append('dependents', dependents);

        try {
            const response = await fetch(`${BACKEND_URL}/upload`, {
                method: 'POST',
                body: data,
            })
            const result = await response.json();
            if (response.ok) {
                setins_task_id(result.task_id);
            } 
            else {
                throw new Error(result.error)
            }

            navigate('/results');
        } 
        catch (err) {
            alert(`Failed to upload files: ${err.message}`)
            navigate('/')
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };


    return (

        <div>
            <Header onOpenModal={handleOpenModal} />
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
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            color: '#333',
                            background: 'transparent',
                            borderRadius: '20px',
                            boxShadow: 'none',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {currentDocIndex === -1 ? (
                        <SelectDocuments
                            docs={docs}
                            setDocs={setDocs}
                            onStartUpload={handleStartUpload}
                        />
                    ) : currentDocIndex < docs.length ? (
                        <UploadInsurancePage
                            doc={docs[currentDocIndex]}
                            onNext={handleNext}
                            isLast={false}
                            onFileUpload={handleFileUpload}
                            fileInputs={fileInputs}
                        />
                    ) : (
                        <UserDetailsPage // raising state
                            onSubmit={handleSubmitAll}
                            age={age}
                            setAge={setAge}
                            hasSpouse={hasSpouse}
                            setHasSpouse={setHasSpouse}
                            dependents={dependents}
                            setDependents={setDependents}
                        />
                    )}
                </Box>
            </Modal>
            <Footer />
        </div>
    );
};


export default Home;
