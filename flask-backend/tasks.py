import os
from pdf2image import convert_from_path
import base64
from dotenv import load_dotenv
load_dotenv()
from celery import Celery
from pathlib import Path
import zipfile
import shutil
from io import StringIO
import pandas as pd 


from lib.amazon_to_template import process_csv_to_xlsx
from lib.get_amazon_from_zip import process_zip_to_csv
from lib.prompt_gpt import prompt_gpt

celery = Celery(
    __name__,
    broker="redis://127.0.0.1:6379/0",
    backend="redis://127.0.0.1:6379/0"
)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

AMZNPROMPT = open(os.path.join(BASE_DIR, 'lib', 'amznprompt.txt'), 'r').read()

# this celery task will be used to analyze the files uploaded by the user
# when calling this function, we will use the filetype variable to label which file it is (e.g. home declaration doc, amazon orders.zip, etc)
# and handle it accordingly
@celery.task(bind=True)
def analyze_file(self, filetype, filepath): 
    if filetype == 'INS':
        # process files
        for filetype, path in filepath.items():
            filebytes = open(path, 'rb').read()
            
            # call AWS
            
            
            # delete file
            os.remove(path)
        
        
        try:
            response = prompt_gpt('cat', False)
            return response
        except:
            raise Exception('Task Failed, please retry or contact us')
    
    # if filetype == 'AMZN':
    #     try:
    #         output_folder = Path(filepath).stem
    #         with zipfile.ZipFile(filepath, 'r') as zip_ref:
    #             zip_ref.extractall(output_folder)
    #         item_list = process_zip_to_csv(output_folder)
    #     except:
    #         # delete files
    #         shutil.rmtree(output_folder)
    #         os.remove(filepath)
    #         raise Exception('Bad .zip file')
            
        
    #     # delete files
    #     shutil.rmtree(output_folder)
    #     os.remove(filepath)
        
    #     userquery = f'''
    #         Process this Amazon purchase history according to your system instructions:
    #         {item_list}
    #         '''
            
    #     try:
    #         response = prompt_gpt(AMZNPROMPT, userquery)
    #         response = response.replace('```csv', '').replace("```", '')
            
    #         response = StringIO(response)  # Create a file-like object from the string
    #         response = pd.read_csv(response)
            
            
    #         while not (isinstance(response.iloc[1, 3], str) and isinstance(response.iloc[1, 4], float)):
    #             print("reran due to misplaced values (hallucination)")
    #             response = prompt_gpt(AMZNPROMPT, userquery)
    #             response = response.replace('```csv', '').replace("```", '')
    #             response = StringIO(response)  # Create a file-like object from the string
    #             response = pd.read_csv(response)

    #         response = response.replace('```csv', '').replace("```", '')
             
    #         xlsx_bytes = process_csv_to_xlsx(response)
            
    #         base64_str = str(base64.b64encode(xlsx_bytes))
            
    #         # remove the leading "b'" and trailing '
    #         if base64_str.startswith("b'") and base64_str.endswith("'"):
    #             base64_str = base64_str[2:-1]
        
    #         return base64_str
    #     except:
    #         raise Exception('Task Failed, please retry or contact us')
        

