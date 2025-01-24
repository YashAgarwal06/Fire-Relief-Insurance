from flask import Flask, request, jsonify
import requests
import base64
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Replace with your actual Google Client ID
GOOGLE_CLIENT_ID = '297023897813-j43iei5ec3q6aeu69pina25thfm3hvjn.apps.googleusercontent.com'

@app.route('/auth/google', methods=['POST'])
def auth_google():
    # Get the access token from the request
    access_token = request.json.get('access_token')
    
    if not access_token:
        return jsonify({'error': 'Access token is missing'}), 400

    # Use the access token to fetch user info from Google
    user_info_response = requests.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    if user_info_response.status_code != 200:
        return jsonify({'error': 'Invalid access token'}), 401

    user_info = user_info_response.json()

    # Call the Gmail API to fetch the user's email messages
    gmail_response = requests.get(
        'https://www.googleapis.com/gmail/v1/users/me/messages?q=your order',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    if gmail_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch Gmail data'}), 401

    gmail_data = gmail_response.json()

    first_email_id = gmail_data['messages'][0]['id']
    resp = requests.get(f'https://www.googleapis.com/gmail/v1/users/me/messages/{first_email_id}',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    email_data = resp.json()
    txt = email_data['payload']['parts'][0]['body']['data']
    decoded = base64.b64decode(txt).decode('ascii')

    # Return the Gmail data along with user info
    return jsonify({
        'email': decoded
    }), 200

if __name__ == '__main__':
    app.run(debug=True)