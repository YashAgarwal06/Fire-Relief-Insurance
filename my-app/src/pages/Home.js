import React, { useState } from 'react';
import { Modal, Box, Button, Typography, AppBar, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link for navigation
import InsuranceFileUpload from './InsuranceFileUpload';
import AmazonFileUpload from './AmazonFileUpload';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import close icon
import '../CoverClear.css';
import Header from './Header';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '500px',
    backgroundColor: 'white',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
};


const pageContentStyle = {
    padding: '20px', // Add this line to set padding to 20px
};
// MultiPageModal component
const MultiPageModal = ({ isModalOpen, setIsModalOpen }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 2;
    const navigate = useNavigate();

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setCurrentPage(0);
    };

    const handleSubmit = () => {
        navigate('/results');
    };


    const renderPageContent = () => {
        switch (currentPage) {
            case 0:
                return (
                    <div className="modal-text" sx={{ padding: '50px' }}>
                        <h2>Upload Insurance Policy</h2>
                        <InsuranceFileUpload />
                    </div>
                );
            case 1:
                return (
                    <div className="modal-text" sx={{ padding: '50px' }}>
                        <h2>Amazon Order History</h2>
                        <AmazonFileUpload />
                    </div>
                );
            // case 2:
            //     return (
            //         <div>
            //             <Typography variant="h6">Page 3: Confirmation</Typography>
            //         </div>
            //     );
            default:
                return <div>Invalid Page</div>;
        }
    };
    const renderDotProgress = () => {
        let dots = [];
        for (let i = 0; i < totalPages; i++) {
            dots.push(
                <span
                    key={i}
                    style={{

                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: currentPage === i ? '#262b2f' : '#ccc',
                        margin: '0 5px',
                        display: 'inline-block',
                    }}
                />
            );
        }
        return dots;
    };

    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                {/* Exit button */}
                <IconButton
                    onClick={handleClose}
                    sx={{
                        padding: '20px',
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        color: '#000'
                    }}

                >
                    <CloseIcon />
                </IconButton>
                <div>{renderPageContent()}</div>
                <div className="modal-progress-bar" style={{ position: 'absolute', bottom: '0', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', backgroundColor: '#7BA6B7', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', }}>
                    <Button sx={{ color: '#262b2f' }} onClick={handlePreviousPage} disabled={currentPage === 0}>
                        Previous
                    </Button>
                    <div>{renderDotProgress()}</div>
                    {/* Conditionally render Submit or Next button */}
                    <div>
                        {currentPage === totalPages - 1 ? (
                            <Button sx={{ color: '#262b2f' }} onClick={handleSubmit}>Submit</Button>
                        ) : (
                            <Button sx={{ color: '#262b2f' }} onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            </Box>
        </Modal>
    );
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
        <div>
            <Header></Header>
            <div className="home-container">
                <div className="home-page-top">
                    <h1 className="home-page-top">
                        Restoring
                        Hope & Stability
                        for Wildfire Survivors
                    </h1>
                </div>
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
                                {/* <li>Bank Statements</li> */}
                                <li>Amazon Order History</li>
                                {/* <li>Gmail Emails (e.g., receipts)</li> */}
                            </ul>
                        </div>
                        <Button variant="contained" onClick={handleGetStartedClick} className="get-started-button">
                            Get Started
                        </Button>
                    </div>
                    <MultiPageModal
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                    />

                </div>
                <div className="coverclear-confidentiality">
                    <h1 className="confidentiality-title">Confidentiality</h1>
                    <p className="confidentiality-description">
                        <span style={{ color: " #d48c76" }}>We respect your privacy.</span>
                        <span style={{ color: "navy" }}>

                            Your information is not stored or shared and is immediately deleted after generating your itemized list.
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

            export default CoverClear;
