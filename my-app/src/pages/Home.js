import React, { useState } from "react"
import { Button, Container, Typography, Box } from "@mui/material"
import InsuranceFileUpload from "./InsuranceFileUpload"
import AmazonFileUpload from "./AmazonFileUpload"
import { useNavigate } from "react-router-dom"
import Header from "./Header"
import homePageImage from "../assets/homepageimage.png"
const CoverClear = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleGetStartedClick = () => {
    setIsModalOpen(true)
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", my: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ color: "#1f4d61", fontWeight: "bold" }}>
            Restoring Hope & Stability for Wildfire Survivors
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", maxWidth: "850px", mx: "auto", mb: 4 }}>
            Insurance claimants affected by the January California Wildfires are attempting to submit itemized claims
            for household items lost in the fires. However, many claimants don't know exactly what was in their home, as
            they were unable to evacuate their property. It's also difficult to create an itemized list without
            reviewing years of receipts.
          </Typography>
          <Button
            variant="contained"
            onClick={handleGetStartedClick}
            sx={{
              backgroundColor: "#ff6b35",
              color: "white",
              padding: "12px 30px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#e55a2b",
              },
            }}
          >
            Get Started
          </Button>
        </Box>

        <Box sx={{ display: "flex", backgroundColor: "#1f4d61", borderRadius: "12px", overflow: "hidden", mb: 6 }}>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src={homePageImage || "/placeholder.svg"}
              alt="Fire Relief Project"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
          <Box sx={{ flex: 1, backgroundColor: "#4C6778", color: "white", p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              1. Upload Your Home Insurance Risk Assessment
            </Typography>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Your Personal Risk Diagnostic</li>
              <li>Areas Of High Exposure</li>
              <li>Tangible Steps to Mitigate Your Risk</li>
            </ul>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
              2. Reclaim Personal Property within Your Policy Limit
            </Typography>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Recreate the California Personal Property Inventory Form per your Insurance Policy.</li>
            </ul>
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="body2" sx={{ color: "#555" }}>
            <span style={{ color: "#d48c76", marginRight: "8px" }}>•</span>
            Confidentiality Note: We respect your privacy. Your information is not stored or shared and is immediately
            deleted after generating your itemized list.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default CoverClear