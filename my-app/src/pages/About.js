import React, { useState } from "react";
import { Modal, Box, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import SelectDocuments from "./SelectDocumentsPage";
import UploadInsurancePage from "./UploadInsurancePage";
import UserDetailsPage from "./UserDetailsPage";
import About from "./About"; // Import the About component
import "../CoverClear.css";
import Header from "../lib/Header";
import Footer from "../lib/Footer";
import "./Home.css";
const { BACKEND_URL } = require("../config.json");

const Home = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false); // State for About modal
    const [docs, setDocs] = useState([]);
    const [currentDocIndex, setCurrentDocIndex] = useState(-1);
    const [fileInputs, setFileInputs] = useState([]);
    const [userDetails, setUserDetails] = useState({ age: "", hasSpouse: false, dependents: 0 });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDocs([]);
        setFileInputs([]);
        setCurrentDocIndex(-1);
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
                            backgroundColor: "#3D2E43",
                            color: "white",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                        }}
                    >
                        Get Started
                    </Button>
                    <Button
                        className="home-page-button"
                        variant="outlined"
                        onClick={() => setIsAboutOpen(true)} // Open About modal
                        style={{
                            marginLeft: "10px",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                        }}
                    >
                        About
                    </Button>
                </div>
            </main>

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={{ /* existing modal styles */ }}>
                    <IconButton onClick={handleCloseModal} sx={{ /* icon styles */ }}>
                        <CloseIcon />
                    </IconButton>

                    {currentDocIndex === -1 ? (
                        <SelectDocuments docs={docs} setDocs={setDocs} onStartUpload={() => {}} />
                    ) : currentDocIndex < docs.length ? (
                        <UploadInsurancePage
                            doc={docs[currentDocIndex]}
                            onNext={() => {}}
                            isLast={false}
                            onFileUpload={() => {}}
                            fileInputs={fileInputs}
                        />
                    ) : (
                        <UserDetailsPage onSubmit={() => {}} />
                    )}
                </Box>
            </Modal>

            {/* About Modal */}
            <About isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

            <Footer />
        </div>
    );
};

export default Home;
