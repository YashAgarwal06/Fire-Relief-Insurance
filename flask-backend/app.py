from flask import Flask, request, jsonify, flash, send_from_directory
import requests
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
import datetime
from pathlib import Path
import uuid
from werkzeug.exceptions import InternalServerError
import logging

from tasks import analyze_file

UPLOAD_FOLDER = 'temp'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = Path(__file__).resolve().parent / UPLOAD_FOLDER

CORS(app)

logging.basicConfig(filename='app.log', level=logging.ERROR)

pending_tasks = set() # very quirky and dumb workaround cuz we dont use any database


# Takes in a flask request object and makes sure that a file exists in the body of the request
def validate_file(request):
    # check if the post request has the file part
    if 'file' not in request.files:
        flash('No file part')
        raise Exception('No file')

    file = request.files['file']

    # If the user does not select a file, the browser submits an empty file without a filename
    if file.filename == '':
        raise Exception('Blank File Name')


@app.route('/upload_hd', methods=['POST'])
def upload_hd():
    try:
        validate_file(request)
    except Exception as e:
        return jsonify({'error': e.args[0]}), 400

    file = request.files['file']

    # save file
    if file and ('.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ['pdf']):
        filename = datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S-%f-") + secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # send this to our celery worker
        task_id = str(uuid.uuid4())
        pending_tasks.add(task_id)
        analyze_file.apply_async(args=['HD', filepath], task_id=task_id)

        return jsonify({'task_id': task_id}), 200
    else:
        return jsonify({'error': "Bad file"}), 400


@app.route('/upload_amzn', methods=['POST'])
def upload_amzn():
    try:
        validate_file(request)
    except Exception as e:
        return jsonify({'error': e.args[0]}), 400

    file = request.files['file']

    # validate file extension
    if file and ('.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ['zip']):
        # save file
        filename = datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S-%f-") + secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # send this to our celery worker
        task_id = str(uuid.uuid4())
        pending_tasks.add(task_id)
        analyze_file.apply_async(args=['AMZN', filepath], task_id=task_id)

        return jsonify({'task_id': task_id}), 200
    else:
        return jsonify({'error': "Bad file"}), 400


# this route is used to get the status of a celery task, Deepseek generated lol
@app.route('/task/<task_id>', methods=['GET'])
def get_task_status(task_id):
    if task_id not in pending_tasks:
        return jsonify({'error': 'No task with specified id'}), 400
    
    task = analyze_file.AsyncResult(task_id)
    
    if task.state == 'PENDING':
        response = {'state': task.state, 'status': 'Pending...'}
    elif task.state == 'SUCCESS':
        response = {'state': task.state, 'result': task.result}
        # Delete the task
        task.forget()  
        pending_tasks.remove(task_id)
    elif task.state == 'FAILURE':
        response = {'state': task.state, 'status': str(task.info)}  # Exception occurred
        # Delete the task
        task.forget()  
        pending_tasks.remove(task_id)
    else:
        response = {'state': task.state, 'status': 'Unknown state'}
    return jsonify(response), 200


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.errorhandler(InternalServerError)
def handle_exception(e):
    logging.error(e, exc_info=True)
    
    # signal kevin
    URL = os.getenv('ERROR_WEBHOOK')
    requests.post(URL, data={
        "content": "check logs nerd"
    })
    
    return jsonify({'error': "Internal Server Error, please try again"}), 500


if __name__ == '__main__':

    if os.getenv('DEV') == 'True':
        app.run(debug=True)
    else:
        app.run(host='0.0.0.0', port=5000)
