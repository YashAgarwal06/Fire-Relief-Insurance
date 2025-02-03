import React, { useState } from "react";
import "./Privacy.css";
import Footer from '../lib/Footer';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { Modal, Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function Privacy() {
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const handleOpenAbout = () => {
        setIsAboutOpen(true);
    };

    const handleCloseAbout = () => {
        setIsAboutOpen(false);
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        backgroundColor: 'white',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        padding: '20px',
        maxHeight: '90vh',
        overflowY: 'auto',
    };

    return (
        <div className="privacy-container">
            <header className="header">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <img src={logo} alt="Logo" className="logo-image" />
                        <span className="logo-name">janus</span>
                    </Link>
                    <nav>
                        <button className="about-button" onClick={handleOpenAbout}>About</button>
                        <a href="/" className="get-started-button">Get Started</a>
                    </nav>
                </div>
            </header>

            {/* About Modal */}
            <Modal open={isAboutOpen} onClose={handleCloseAbout}>
                <Box sx={modalStyle}>
                    <IconButton
                        onClick={handleCloseAbout}
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
                    <Typography variant="h5" gutterBottom>
                        About Our Product
                    </Typography>
                    <Typography variant="body1">
                        Our product is designed to help individuals better understand the complexities of insurance 
                        policies, especially in times of crisis like the recent California wildfires. It simplifies 
                        the process of filing insurance claims for household items lost in disasters, offering clarity 
                        on two common claim valuation methods: lump-sum and itemized approaches.
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: '10px' }}>
                        Inspired by the experience of a close mentor from UCLA's Bruin AI Club, who lost his home in the 
                        Palisades, our team was motivated to create a solution that empowers others facing similar challenges. 
                        Developed by passionate students in the Bruin AI Club, this tool makes insurance claims more accessible, 
                        transparent, and easier to navigate.
                    </Typography>
                </Box>
            </Modal>

            <div className="privacy-text">
                <div className="privacy-header">
                    <h1>Privacy Policy</h1>
                    <p>Last updated: February 2, 2005</p>
                </div>
                <h2>1. Introduction</h2>
                <p>
                    Welcome to Janus. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.
                </p>

                <h2>2. Information We Collect</h2>
                <p>We may collect personal and non-personal information, including but not limited to:</p>
                <ul>
                    <li>Your name and contact details when provided voluntarily.</li>
                    <li>Usage data, including pages visited and interactions.</li>
                    <li>Cookies and tracking technologies.</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We use the collected data to:</p>
                <ul>
                    <li>Improve our services and user experience.</li>
                    <li>Communicate with you regarding updates or support.</li>
                    <li>Analyze traffic and usage patterns.</li>
                </ul>

                <h2>4. Third-Party Services</h2>
                <p>
                    We may use third-party services to enhance functionality. These services may have their own privacy policies that apply to your data.
                </p>

                <h2>5. Data Security</h2>
                <p>We take reasonable measures to protect your information, but no method of transmission over the internet is completely secure.</p>

                <h2>6. Your Choices</h2>
                <p>You have the right to opt out of certain data collection practices, including cookies and email communications.</p>

                <h2>7. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. Continued use of our website constitutes acceptance of the revised policy.</p>

                <h2>8. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:bruinaiucla@gmail.com">bruinaiucla@gmail.com</a>.</p>
            </div>
            <Footer />
        </div>
    );
}
