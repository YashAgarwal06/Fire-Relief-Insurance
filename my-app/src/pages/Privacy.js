import React from "react";
import "./Privacy.css";
import Footer from '../lib/Footer';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


export default function Privacy() {
    return (
        <div className="privacy-container">
            <header className="header">
                <div className="header-content">
                    <Link to="/" className="logo"> {/* Link component for home redirection */}
                        <img src={logo} alt="Logo" className="logo-image" />
                        <span className="logo-name">janus</span>
                    </Link>
                    <nav>
                        <a href="#about" className="nav-link">About</a>
                        <a href="/" className="nav-link">Get Started</a>

                    </nav>
                </div>
            </header>
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
