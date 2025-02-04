import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./Footer.css";
import { Modal, Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../assets/Logo_BAI.png'; // Import the logo

export default function Footer() {
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
    <footer className="footer">
      <hr className="footer-line" />

      <div className="footer-div">
        {/* Add the logo here */}
        <div className="footer-logo-container">
        <img src={logo} alt="Bruin AI Logo" className="footer-logo" />
        <p className="footer-made-by-bruin-ai">Made by students of UCLA Bruin AI</p>
        </div>
        <div className="footer-links">
          <button className="about-button" onClick={handleOpenAbout}>About</button>
          <Link to="/privacy" className="footer-page">Privacy</Link>
          <a href="https://www.bruinai.org/" className="footer-bruin-ai-link" target="_blank" rel="noopener noreferrer">Bruin AI</a>
        </div>
      </div>

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
    </footer>
  );
}