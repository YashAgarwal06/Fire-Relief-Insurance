# fire-relief

domain: coverclear.bruinai.org
Useful commands for backend
```
celery -A tasks.celery worker --loglevel=info
gunicorn --bind 0.0.0.0:5000 wsgi:app
```
