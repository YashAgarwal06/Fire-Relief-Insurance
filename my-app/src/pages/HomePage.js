import { useGoogleLogin } from '@react-oauth/google';

function HomePage() {
    const handleLoginSuccess = async (response) => {
        console.log('Access Token:', response.access_token);

        // Send the access token to your Flask backend
        const backendResponse = await fetch('http://localhost:5000/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ access_token: response.access_token }),
        });

        const data = await backendResponse.json();
        if (backendResponse.ok) {
            console.log('Authentication successful:', data);
        } else {
            console.error('Authentication failed:', data.error);
        }
    };

    const login = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: () => {
            console.log('Login Failed');
        },
        scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly', // Add the required scopes here
        responseType: 'token', // Request an access token
    });

    return (
        <button onClick={login}>
            Sign in with Google
        </button>
    );
}

export default HomePage;