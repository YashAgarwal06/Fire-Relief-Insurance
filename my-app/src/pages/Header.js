import React, { useState } from 'react';
import { Modal, Box, Button, Typography, AppBar, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../CoverClear.css';
import { defaultUrlTransform } from 'react-markdown';


const Header = () => {
    return (
        <div className="header">
        {/* Header Section */}
        <AppBar position="static" sx={{ backgroundColor: '#1f4d61' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
                        CoverClear
                    </Link>
                </Typography>
            </Toolbar>
        </AppBar>
        </div>
    )
}

export default Header;