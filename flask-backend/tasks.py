import time
import os
from pdf2image import convert_from_path
import pytesseract
import time
import PyPDF2
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


HDPROMPT = open('lib/hdprompt.txt', 'r').read()
AMZNPROMPT = open('lib/amznprompt.txt', 'r').read()

# this celery task will be used to analyze the files uploaded by the user
# when calling this function, we will use the filetype variable to label which file it is (e.g. home declaration doc, amazon orders.zip, etc)
# and handle it accordingly
@celery.task(bind=True)
def analyze_file(self, filetype, filepath): 
    if filetype == 'HD':
        # perform OCR
        start_time = time.time()
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            total_pages = len(reader.pages)
        
        last_page = 6
        if total_pages < 6:
            last_page = total_pages

        images = convert_from_path(filepath, first_page=0, last_page=last_page)
        text = ""
        for image in images:
            text += pytesseract.image_to_string(image)
        print("OCR Took: --- %s seconds ---" % (time.time() - start_time))
        
        # delete file
        os.remove(filepath)
        
        try:
            response = prompt_gpt(HDPROMPT, text)
            return response
        except:
            raise Exception('Task Failed, please retry or contact us')
    
    if filetype == 'AMZN':
        try:
            output_folder = Path(filepath).stem
            with zipfile.ZipFile(filepath, 'r') as zip_ref:
                zip_ref.extractall(output_folder)
            item_list = process_zip_to_csv(output_folder)
        except:
            # delete files
            shutil.rmtree(output_folder)
            os.remove(filepath)
            raise Exception('Bad .zip file')
            
        
        # delete files
        shutil.rmtree(output_folder)
        os.remove(filepath)
        
        userquery = f'''
            Process this Amazon purchase history according to your system instructions:
            {item_list}
            '''
            
        try:
            response = prompt_gpt(AMZNPROMPT, userquery)
            response = response.replace('```csv', '').replace("```", '')
            
            response = StringIO(response)  # Create a file-like object from the string
            response = pd.read_csv(response)
            
            if isinstance(response.iloc[1, 3], str) and isinstance(response.iloc[1, 4], float):
                # If the conditions are true, do nothing or proceed with further operations
                pass
            else:
                # If the conditions are false, call the prompt_gpt function and process the response
                print("reran due to misplaced values (hallucination)")
                response = prompt_gpt(AMZNPROMPT, userquery)
                response = response.replace('```csv', '').replace("```", '')
                            
            
            xlsx_bytes = process_csv_to_xlsx(response)
            
            base64_str = str(base64.b64encode(xlsx_bytes))
            
            # remove the leading "b'" and trailing '
            if base64_str.startswith("b'") and base64_str.endswith("'"):
                base64_str = base64_str[2:-1]
        
            return base64_str
        except:
            raise Exception('Task Failed, please retry or contact us')
        

