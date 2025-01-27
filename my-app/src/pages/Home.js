import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import InsuranceFileUpload from './InsuranceFileUpload';
import AmazonFileUpload from './AmazonFileUpload';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../CoverClear.css';
import Header from './Header';
import homePageImage from '../assets/homepageimage.png';


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
                    <Button sx={{ color: '#262b2f', padding: '12px', }} onClick={handlePreviousPage} disabled={currentPage === 0}>
                        Previous
                    </Button>
                    <div>{renderDotProgress()}</div>
                    <div>
                        {currentPage === totalPages - 1 ? (
                            <Button sx={{ color: '#262b2f', padding: '12px', }} onClick={handleSubmit}>Submit</Button>
                        ) : (
                            <Button sx={{ color: '#262b2f', padding: '12px', }} onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
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

    return (
        <div>
            <Header></Header>
            <div style={{ padding: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#262b2f' }}>
                        Restoring Hope & Stability for Wildfire Survivors
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: '#555',
                        margin: '40px auto',
                        maxWidth: '850px',
                        lineHeight: '1.6'
                    }}>
                        Insurance claimants affected by the January California Wildfires are attempting to submit itemized claims for household items lost in the fires. However, many claimants don’t know exactly what was in their home, as they were unable to evacuate their property. It’s also difficult to create an itemized list without reviewing years of receipts.
                    </p>
                </div>

                {/* Updated Features Section */}
                <div style={{
                    backgroundColor: '#1f4d61',
                    color: 'white',
                    padding: '40px 20px',
                    margin: '40px -20px', // Negative margin to expand width
                }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', textAlign: 'center' }}>Features</h2>
                    <ul style={{ listStyleType: 'none', paddingLeft: 0, maxWidth: '800px', margin: '0 auto' }}>
                        <li style={{ marginBottom: '15px' }}>
                            ✔ Understand How to Reclaim Your Personal Property Based on Your Insurance Policy
                        </li>
                        <li>
                            ✔ Itemize Your Inventory Using Data From:
                            <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                                <li style={{ marginBottom: '8px' }}>• Bank Statements</li>
                                <li style={{ marginBottom: '8px' }}>• Amazon History</li>
                                <li>• Gmail Receipts</li>
                            </ul>
                        </li>
                        <li style={{ marginTop: '20px' }}>
                            ✔ Checklist for Gathering Information:
                            <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                                <li style={{ marginBottom: '8px' }}>• Insurance Policy</li>
                                <li>• Amazon Order History</li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div
                    style={{
                        display: "flex",
                        backgroundColor: "#1f4d61",
                        height: "300px",
                        justifyContent: "center", // Center the blocks horizontally if needed
                        alignItems: "center", // Center the content inside blocks vertically
                    }}
                >
                    <div style={{ flex: 1, backgroundColor: "blue" }}>
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#7BA6B7" }}>
                        <img
                            src={homePageImage}
                            alt="Image"
                            style={{ objectFit: "cover", height: "300px", width: "100%" }}
                        />
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#7BA6B7" }}>
                    <ul style={{ listStyleType: 'none', paddingLeft: 0, maxWidth: '800px', margin: '0 auto' }}>
                        <li style={{ marginBottom: '15px' }}>
                            Understand How to Reclaim Your Personal Property Based on Your Insurance Policy
                        </li>
                        <li>
                            ✔ Itemize Your Inventory Using Data From:
                            <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                                <li style={{ marginBottom: '8px' }}>• Bank Statements</li>
                                <li style={{ marginBottom: '8px' }}>• Amazon History</li>
                                <li>• Gmail Receipts</li>
                            </ul>
                        </li>
                        <li style={{ marginTop: '20px' }}>
                            ✔ Checklist for Gathering Information:
                            <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                                <li style={{ marginBottom: '8px' }}>• Insurance Policy</li>
                                <li>• Amazon Order History</li>
                            </ul>
                        </li>
                    </ul>
                    </div>
                    <div style={{ flex: 1, backgroundColor: "purple" }}></div>
                </div>

                {/* Moved Get Started Button */}
                <div style={{ textAlign: 'center', margin: '40px 0' }}>
                    <Button
                        variant="contained"
                        onClick={handleGetStartedClick}
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

                <div style={{
                    margin: '40px auto 0',
                    textAlign: 'center'
                }}>
                    {/* <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#262b2f', marginBottom: '10px' }}>Confidentiality</h1> */}
                    <p style={{ fontSize: '1rem', color: '#555' }}>
                        <span style={{ color: '#d48c76' }}>.</span>{' '}
                        <span >
                            Confidentiality Note: We respect your privacy. Your information is not stored or shared and is immediately deleted after generating your itemized list.
                        </span>
                    </p>
                </div>
            </div>
            <MultiPageModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </div>
    );
};

export default CoverClear;