import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage.js'

function App() {
  return (
    <GoogleOAuthProvider clientId="297023897813-j43iei5ec3q6aeu69pina25thfm3hvjn.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
