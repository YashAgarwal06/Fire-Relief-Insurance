import pandas as pd 
import numpy as np 

import PyPDF2

# Open your PDF file
with open('Bank Data/BoA_Kevin_Data.pdf', 'rb') as file:
    reader = PyPDF2.PdfReader(file)
    
    # Initialize a variable to store extracted text
    text = ''
    
    # Loop through each page and extract text
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        text += page.extract_text()

# Print the extracted text
print(text)