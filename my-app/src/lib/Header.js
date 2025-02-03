import React from 'react';
import { Typography, AppBar, Toolbar } from '@mui/material';
import "./Header.css";
import { useNavigate } from 'react-router-dom'; // if you use React Router for navigation
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


const Header = ({ onOpenModal }) => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo"> {/* Link component for home redirection */}
                    <img src={logo} alt="Logo" className="logo-image" />
                    <span className="logo-name">janus</span>
                </Link>
                <nav>
                    <a href="#about" className="nav-link">About</a>
                    <button className="get-started-button" onClick={onOpenModal}>Get Started</button>
                </nav>
            </div>
        </header>
    );
};

export default Header;