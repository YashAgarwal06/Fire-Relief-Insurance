import zipfile
import pandas as pd
from dotenv import load_dotenv
from openai import AzureOpenAI
import os

path = 'Bank Data/Your Orders.zip'
output = 'data_files'

# Unzip the file
with zipfile.ZipFile(path, 'r') as zip_ref:
    zip_ref.extractall(output)

folder_path = os.path.join(output, 'Retail.OrderHistory.1')

if os.path.exists(folder_path):
    csv_path = os.path.join(folder_path, 'Retail.OrderHistory.1.csv')

    if os.path.exists(csv_path):
        data = pd.read_csv(csv_path)
    else:
        print("File not found")
else:
    print("File not found")



import pandas as pd

returns_file = 'data_files/Retail.OrdersReturned.Payments.1/Retail.OrdersReturned.Payments.1.csv'
output_file = 'filtered_orders.csv'

returns_data = pd.read_csv(returns_file)

# Ensure 'OrderID' columns are comparable
returns_subset = returns_data[['OrderID', 'AmountRefunded']]

# Step 2: Cross-reference and filter rows in the data DataFrame
# Ensure 'Total Owed' is numeric to avoid type issues
data['Total Owed'] = pd.to_numeric(data['Total Owed'], errors='coerce')

# Merge data with returns_subset on matching 'Order ID' and 'Total Owed'
merged_data = data.merge(returns_subset, left_on=['Order ID', 'Total Owed'], right_on=['OrderID', 'AmountRefunded'], how='left', indicator=True)

# Keep rows that do not match ('_merge' is 'left_only')
filtered_data = merged_data[merged_data['_merge'] == 'left_only']

# Drop unnecessary '_merge', 'OrderID', and 'Amount Refunded' columns
filtered_data = filtered_data.drop(columns=['_merge', 'OrderID', 'AmountRefunded'])

# Print the final filtered DataFrame

data['Total Owed'] = pd.to_numeric(data['Total Owed'], errors='coerce')
filtered_data = data[data['Total Owed'] > 10] #changed from 60 to 10 for now
result = filtered_data[['Order Date', 'Product Name', 'Total Owed']]
result.to_csv('amazon_important_orders.csv', index=False)


#GPT processing
load_dotenv()
API_KEY = os.getenv('API_KEY')


client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("API_KEY"),  
  api_version=os.getenv("API_VERSION")
)

item_list = pd.read_csv("amazon_important_orders.csv")
item_list = item_list.to_csv(index=False)


response = client.chat.completions.create(
    model=os.getenv('MODEL'),
    messages=[
        {
            "role": "system",
            "content": (
                "You are an insurance claim assistant. "
                "Your role is to look through past purchase histories and find important items. "
                "Identify items that are likely present in a house, are valuable, and can be restored by an insurance claim. "
                "The output should be formatted as only a CSV, but keep in mind that there are commas in the item names, so it is important to keep those item names in tact."
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
print(llm_filtered_items)

output_file = "amazon_llm_filtered_items.csv"
with open(output_file, "w", newline="") as file:
    file.write(llm_filtered_items)





