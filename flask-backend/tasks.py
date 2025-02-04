import pandas as pd
from lib.pdf_files_to_perplexity import pdf_to_images, process_images_with_textract, prompt_perplexity
from lib.prompt_gpt import prompt_gpt
from lib.get_amazon_from_zip import process_zip_to_csv
from lib.amazon_to_template import process_csv_to_xlsx
from io import StringIO
import shutil
import zipfile
from pathlib import Path
from celery import Celery
import os
from pdf2image import convert_from_path
import base64
from dotenv import load_dotenv
load_dotenv()


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
def analyze_file(self, tasktype, filepaths, age, hasSpouse, dependents):
    print(tasktype, filepaths, age, hasSpouse, dependents)
    if tasktype == 'INS':
        try:
            # for every filepath in filepaths, we break it into images
            image_dict = {}
            for filetype, filepath in filepaths.items():
                ims = pdf_to_images(filepath)
                image_dict[filetype] = ims
                
                os.remove(filepath)
                
            # now we read the text from each list of images
            txt = ''
            for doctype, images in image_dict.items():
                txt += f'My policy for {doctype} insurance:\n===================\n'
                txt += process_images_with_textract(images)
                txt += '\n\n'
            
            # finally calling perplexity
            
            structure = (
            '''
            1. What do you have covered?
                a. Break down by coverage type
            2. What is your overall risk protection score?
                a. Provide an overall score (a percentage)
                b. Break this down by each coverage type - provide reasoning for each
                c. Provide strengths and weaknesses for each of the categories
            3. What are the next steps you can do to defend yourself from further risk?
                a. Provide a step by step analysis based on the risk protection score
                b. Include real policies that could be purchased to supplement the weaknesses. Ensure they fit with the individual's address, family background, age, etc.
            '''
            )

            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant that answers questions about company policies."
                        "Only reply with data from your searches if it matches the situation exactly."
                        "Only rely on information we provide for you otherwise."
                        f"Display your response in this exact format in Markdown: {structure}"
                        "Please return raw Markdown text, thank you"
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"Here is my situation: Age: {age}, Has Spouse: {hasSpouse}, Number of Dependents: {dependents}."
                        f"Here are the policies:\n\n{txt}"
                    )
                }
            ]
            
            response = prompt_perplexity(messages)
            
            open('output.md', 'w').write(response)
            
            return response
        except:
            raise Exception('Task Failed, please retry or contact us')
    
    
    
    
    # if tasktype == 'AMZN':
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
        

