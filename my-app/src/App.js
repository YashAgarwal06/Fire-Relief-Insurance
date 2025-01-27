import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage.js'
import config from './config.json'
const GOOGLE_CLIENT_ID = config['GOOGLE_CLIENT_ID']

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
