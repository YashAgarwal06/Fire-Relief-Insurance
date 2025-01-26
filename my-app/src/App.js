import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage';
import FileUpload from './components/FileUpload';

function App() {
    return (
        <GoogleOAuthProvider clientId="your-client-id">
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/upload" element={<FileUpload />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
