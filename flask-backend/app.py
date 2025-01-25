from flask import Flask, request, jsonify, flash
import requests
import base64
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
import datetime
from pathlib import Path

UPLOAD_FOLDER = 'temp'
ALLOWED_EXTENSIONS = {'pdf'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = Path(__file__).resolve().parent / UPLOAD_FOLDER

CORS(app)

GOOGLE_CLIENT_ID = '297023897813-j43iei5ec3q6aeu69pina25thfm3hvjn.apps.googleusercontent.com'


@app.route('/auth/google', methods=['POST'])
def auth_google():
    # Get the access token from the request
    access_token = request.json.get('access_token')

    # check if missing access_token
    if not access_token:
        return jsonify({'error': 'Access token is missing'}), 400

    # Validate token info
    user_info_response = requests.get(
        'https://www.googleapis.com/oauth2/v3/tokeninfo',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if user_info_response.status_code != 200:
        return jsonify({'error': 'Invalid access token'}), 401

    # Call the Gmail API to fetch the user's email messages
    next_page_token = ''
    gmail_ids = []

    while True:
        url = 'https://www.googleapis.com/gmail/v1/users/me/messages?q={subject:"confirm order" subject:"purchase" subject:"receipt"}'
        if (next_page_token):
            url += "&pageToken=" + next_page_token

        gmail_response = requests.get(
            url,
            headers={'Authorization': f'Bearer {access_token}'}
        )

        if gmail_response.status_code != 200:
            return jsonify({'error': 'Failed to fetch Gmail data'}), 401

        resp = gmail_response.json()

        gmail_ids += [i['id'] for i in resp['messages']]
        if ('nextPageToken' in resp):
            next_page_token = resp['nextPageToken']
        else:
            break

    for id in gmail_ids:
        resp = requests.get(f'https://www.googleapis.com/gmail/v1/users/me/messages/{id}',
                            headers={'Authorization': f'Bearer {access_token}'}
                            )
        email_data = resp.json()

        for header in email_data['payload']['headers']:
            if header["name"] == 'From':
                print(header['value'], end=' ')
            if header["name"] == 'Subject':
                print(header['value'])

    # Return the Gmail data along with user info
    return jsonify({
        'email': 'cat'
    }), 200

# Function that makes sure the uploaded file has the correct filename
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload_hd', methods=['POST'])
def upload_hd():
    # check if the post request has the file part
    if 'file' not in request.files:
        flash('No file part')
        return jsonify({'error': "No file"}), 400
    
    file = request.files['file']
    
    # If the user does not select a file, the browser submits an empty file without a filename
    if file.filename == '':
        return jsonify({'error': "Blank File Name"}), 400
    
    # save file
    if file and allowed_file(file.filename):
        filename = datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S-%f-") + secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        return jsonify({'message': filename}), 200
    else:
        return jsonify({'error': "Bad file"}), 400


if __name__ == '__main__':
    app.run(debug=True)
