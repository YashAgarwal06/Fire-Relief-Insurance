import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ContextStoreProvider } from './lib/ContextStore';
import CoverClear from './pages/Home';
import LoadingPage from './pages/LoadingPage'; // Import Loading Page
import ResultsPage from './pages/ResultsPage'; // Import Results Page

function App() {
    return (
        <ContextStoreProvider>
            <Router>
                <Routes>
                    {/* <Route path="/" element={<HomePage />} /> */}
                    <Route path="/" element={<CoverClear />} />
                    <Route path="/loading" element={<LoadingPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                </Routes>
            </Router>

        </ContextStoreProvider>
    );
}

export default App;
