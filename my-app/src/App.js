import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ContextStoreProvider } from './lib/ContextStore';
import CoverClear from './pages/Home';
import LoadingPage from './pages/LoadingPage'; // Import Loading Page
import ResultsPage from './pages/ResultsPage'; // Import Results Page
import config from './config.json'

const GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID

function App() {
    return (
        <ContextStoreProvider>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <Router>
                    <Routes>
                        {/* <Route path="/" element={<HomePage />} /> */}
                        <Route path="/" element={<CoverClear />} />
                        <Route path="/loading" element={<LoadingPage />} />
                        <Route path="/results" element={<ResultsPage />} />
                    </Routes>
                </Router>
            </GoogleOAuthProvider>
        </ContextStoreProvider>
    );
}

export default App;
