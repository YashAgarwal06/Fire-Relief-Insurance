import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ContextStoreProvider } from './lib/ContextStore';
import CoverClear from './pages/Home';
import ResultsPage from './pages/ResultsPage'; // Import Results Page
import Privacy from './pages/Privacy'; // Import Privacy Page
function App() {
    return (
        <ContextStoreProvider>
            <Router>
                <Routes>
                    {/* <Route path="/" element={<HomePage />} /> */}
                    <Route path="/" element={<CoverClear />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/privacy" element={<Privacy />} />
                </Routes>
            </Router>

        </ContextStoreProvider>
    );
}

export default App;
