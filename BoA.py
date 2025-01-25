import pandas as pd 
import numpy as np 

import PyPDF2
from dotenv import load_dotenv
from openai import AzureOpenAI
import os

# Open your PDF file
with open('Bank Data/BoA_Kevin_Data.pdf', 'rb') as file:
    reader = PyPDF2.PdfReader(file)
    
    # Initialize a variable to store extracted text
    text = ''
    
    # Loop through each page and extract text
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        text += page.extract_text()


load_dotenv()
API_KEY = os.getenv('API_KEY')


client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("API_KEY"),  
  api_version=os.getenv("API_VERSION")
)

response = client.chat.completions.create(
    model=os.getenv('MODEL'),
    messages=[
        {
            "role": "system",
            "content": (
                "You are an insurance claim assistant. "
                "Your role is to look through past purchase histories and find important items. "
                "Identify items that are likely present in a house, are valuable, and can be restored by an insurance claim. "
                "The output should be formatted as only a CSV."
            ),
        },
        {
            "role": "user",
            "content": (
                "Here is a list of items and their prices:\n\n" + text +
                "\nParse through the list and filter out non-relevant items that wouldn't be in a household (check the store to see if that store sells a lot of household items). "
                "Keep only items that are in a house, valuable, and restorable by an insurance claim."
            ),
        },
    ]
)

llm_filtered_items = response.choices[0].message.content

output_file = "BoA_llm_filtered_items.csv"
with open(output_file, "w", newline="") as file:
    file.write(llm_filtered_items)

