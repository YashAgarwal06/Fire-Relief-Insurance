import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage';
import CoverClear from './pages/Home';
import LoadingPage from './pages/LoadingPage'; // Import Loading Page
import ResultsPage from './pages/ResultsPage'; // Import Results Page

function App() {
    return (
        <GoogleOAuthProvider clientId="your-client-id">
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<CoverClear />} />
                    <Route path="/loading" element={<LoadingPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
