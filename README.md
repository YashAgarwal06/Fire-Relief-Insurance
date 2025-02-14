This tool helps automatically process users' amazon orders into an insurance-formatted itemized receipt for them to submit. It also analyzes users' insurance policies and provide quick, key insights for them to understand their insurance better and also recommendations to take after a disaster such as a fire. 

# fire-relief

domain: coverclear.bruinai.org
Useful commands for backend
```
celery -A tasks.celery worker --loglevel=info
gunicorn --bind 0.0.0.0:5000 wsgi:app
```
