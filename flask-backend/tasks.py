from celery import Celery
import time
import platform
import os

if platform.system() == 'Windows': # have to remove multithreading if on a windows system
    os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')
    
celery = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')
celery.conf.result_expires = 600  # 10 minutes

# this celery task will be used to analyze the files uploaded by the user
# when calling this function, we will use the filetype variable to label which file it is (e.g. home declaration doc, amazon orders.zip, etc)
# and handle it accordingly
@celery.task(bind=True)
def analyze_file(self, filetype, filename):
    
    if filetype == 'HD':
        """
        TODO: ADD KHUSH'S PROMPT
        """
    
        # dummy code
        time.sleep(5)
        return f"Task completed after {5} seconds"
    
    if filetype == 'AMZN':
        """
        TODO: ADD AMAZON ORDER PARSING
        """
        
        # dummy code
        time.sleep(5)
        return "cats"
