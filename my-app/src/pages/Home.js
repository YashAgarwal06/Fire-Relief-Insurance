import React, { useState } from 'react';
import { Modal, Box, Button, CircularProgress } from '@mui/material';
import InsuranceFileUpload from './InsuranceFileUpload';
import AmazonFileUpload from './AmazonFileUpload';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../CoverClear.css';
import Header from './Header';
import homePageImage from '../assets/homepageimage.png';
import { useContextStore } from '../lib/ContextStore';


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '400px',
    backgroundColor: 'white',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
};

const MultiPageModal = ({ isModalOpen, setIsModalOpen }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const { ins_task_id, setins_task_id } = useContextStore();
    const { amzn_task_id, setamzn_task_id } = useContextStore();

    const totalPages = 2;
    const navigate = useNavigate();

    const handleNextPage = () => {
        // if they didn't upload a file, yell at 'em
        if (ins_task_id === '') {
            return alert('Please upload a copy of your home insurance policy')
        }
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
        if (ins_task_id === '' && amzn_task_id === '') {
            alert('Please upload at least an Insurance Policy or Amazon Order History')
        }
        else navigate('/results');
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
                        <h2>Amazon Order History (Optional)</h2>
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
            <div style={{  }}>
                <div style={{ textAlign: 'center', marginTop: '80px', marginBottom: '40px' }}>
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
                 {/* Moved Get Started Button */}
                 <div style={{ textAlign: 'center', marginBottom: '60px' }}>
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

                <div
                    style={{
                        display: "flex",
                        backgroundColor: "#1f4d61",
                        height: "350px",
                        justifyContent: "center", // Center the blocks horizontally if needed
                        alignItems: "center", // Center the content inside blocks vertically
                        margin: '40px -20px', // Negative margin to expand width
                    }}
                >
                    <div style={{ flex: 1, backgroundColor: "blue" }}>
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#4C6778", display: 'flex', alignItems: 'flex-start', height: '350px', }}>
                        <img
                            src={homePageImage}
                            alt="Image"
                            style={{ objectFit: "contain", height: "auto", width: "100%", verticalAlign:'top'}}
                        />
                    </div>
                    <div style={{ flex: 1,  backgroundColor: "#4C6778", color: 'white', minHeight: '350px',maxHeight: '300px', paddingLeft: '20px', justifyContent: 'center', flexDirection: 'column',}}>
                    <p style={{ marginBottom: '5px', padding: '10px', marginTop: '20px', fontWeight:'bold' }}>
                            1. Upload Your Home Insurance Risk Assessment
                        </p>
                    <ol style={{ listStyleType: 'none', paddingLeft: '1px', paddingRight: '10px', maxWidth: '800px', margin: '0 auto' }}>
                        <li>
                            <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginTop: '5px' }}>
                                <li style={{ marginBottom: '4px' }}>• Your Personal Risk Diagnostic</li>
                                <li style={{ marginBottom: '4px' }}>• Areas Of High Exposure</li>
                                <li>• Tangible Steps to Mitigate Your Risk</li>
                            </ul>
                        </li>
                    </ol>
                    <p style={{ marginBottom: '5px', padding: '10px', fontWeight: 'bold' }}>
                    2. Reclaim Personal Property within Your Policy Limit                        </p>
                    <ol style={{ listStyleType: 'none', paddingLeft: '10px', paddingRight: '10px', maxWidth: '800px', margin: '0 auto' }}>
                        <li>
                            <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginTop: '5px' }}>
                                <li>• Recreate the California Personal Property Inventory Form per your Insurance Policy.
                                </li>
                            </ul>
                        </li>
                    </ol>
                    </div>
                    <div style={{ flex: 1, }}></div>
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