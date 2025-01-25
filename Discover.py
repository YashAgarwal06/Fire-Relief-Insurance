import pandas as pd
from dotenv import load_dotenv
from openai import AzureOpenAI
import os

load_dotenv()
API_KEY = os.getenv('API_KEY')

file_path = 'Bank Data/Discover-AllAvailable-20250123.csv'
data = pd.read_csv(file_path)


# unique_categories = data['Category'].unique()
# print("Unique Categories:")
# for category in unique_categories:
#     print(category)

categories = ['Merchandise', 'Home Improvement', 'Warehouse Clubs', 'Department Stores']
filtered_data = data[data['Category'].isin(categories)]

threshold = 75
items = filtered_data[filtered_data['Amount'] >= threshold]

items.to_csv('discover_important_purchases.csv', index=False)

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("API_KEY"),  
  api_version=os.getenv("API_VERSION")
)

item_list = items.to_csv(index=False)

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
                "Here is a list of items and their prices:\n\n" + item_list +
                "\nParse through the list and filter out non-relevant items. "
                "Keep only items that are in a house, valuable, and restorable by an insurance claim."
            ),
        },
    ]
)

llm_filtered_items = response.choices[0].message.content

output_file = "discover_llm_filtered_items.csv"
with open(output_file, "w", newline="") as file:
    file.write(llm_filtered_items)

