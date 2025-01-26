import time
import os
from pdf2image import convert_from_path
import pytesseract
import time
import PyPDF2
from dotenv import load_dotenv
load_dotenv()
from openai import AzureOpenAI
from celery import Celery
from pathlib import Path
import pandas as pd
import shutil
import zipfile

celery = Celery(
    __name__,
    broker="redis://127.0.0.1:6379/0",
    backend="redis://127.0.0.1:6379/0"
)

client = AzureOpenAI(
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
    api_key=os.getenv("API_KEY"),  
    api_version=os.getenv("API_VERSION")
)

HDPROMPT = open('hdprompt.txt', 'r').read()
AMZNPROMPT = open('amznprompt.txt', 'r').read()

# prompts ChatGPT
def prompt_gpt(prompt: str, userinput: str) -> str:
    response = client.chat.completions.create(
        model=os.getenv('MODEL'),
        messages=[
            {
                "role": "system",
                "content": prompt
            },
            {
                "role": "user",
                "content": userinput
            },
        ],
        temperature=0.25,
    )

    return response.choices[0].message.content


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
        output_folder = Path(filepath).stem
        with zipfile.ZipFile(filepath, 'r') as zip_ref:
            zip_ref.extractall(output_folder)
        
        try:
            returns_file_path = os.path.join(output_folder, 'Retail.OrdersReturned.Payments.1', 'Retail.OrdersReturned.Payments.1.csv')
            orders_file_path = os.path.join(output_folder, 'Retail.OrderHistory.1', 'Retail.OrderHistory.1.csv')
        except:
            raise Exception('Bad Amazon Order .zip file')
        
        orders_data = pd.read_csv(orders_file_path)
        returns_data = pd.read_csv(returns_file_path)

        orders_data['Total Owed'] = pd.to_numeric(orders_data['Total Owed'], errors='coerce')
        orders_data = orders_data[['Order ID', 'Order Date', 'Total Owed', 'Quantity', 'Product Name']]
        orders_data = orders_data.loc[orders_data['Quantity'] != 0]
        orders_data['Order Date'] = pd.to_datetime(orders_data['Order Date']).dt.strftime('%Y-%d-%m')
        returns_subset = returns_data[['OrderID', 'AmountRefunded']].rename(columns={'OrderID': 'Order ID'})
        # Perform an inner merge to find matching rows based on the two conditions
        matching_rows = pd.merge(
            orders_data,
            returns_subset.rename(columns={'AmountRefunded': 'Total Owed'}),
            on=['Order ID'],
            how='inner'
        )
        # Filter rows where 'Total Owed' in data matches 'AmountRefunded' in returns_subset
        matching_rows = matching_rows[matching_rows['Total Owed_x'] == matching_rows['Total Owed_y']]
        # Remove matching rows from `data`
        orders_data = orders_data[~orders_data['Order ID'].isin(matching_rows['Order ID']) | 
                    ~orders_data['Total Owed'].isin(matching_rows['Total Owed_x'])]
        orders_data['Total Owed'] = pd.to_numeric(orders_data['Total Owed'], errors='coerce')
        filtered_data = orders_data[orders_data['Total Owed'] > 70] 
        result = filtered_data[['Order Date', 'Quantity', 'Product Name', 'Total Owed']]
        
        item_list = result.to_csv(index=False)
        
        # delete the files
        os.remove(filepath)
        shutil.rmtree(output_folder)
        
        userquery = f'''
            Process this Amazon purchase history according to your system instructions:
            {item_list}
            '''
            
        try:
            response = prompt_gpt(AMZNPROMPT, userquery)
            response = response.replace('```csv', '').replace("```", '')
            open('test.csv', 'w').write(response)
            return response
        except:
            raise Exception('Task Failed, please retry or contact us')
        

