import zipfile
import os
import pandas as pd

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

data['Unit Price'] = pd.to_numeric(data['Unit Price'], errors='coerce')
filtered_data = data[data['Unit Price'] > 60]
result = filtered_data[['Order Date', 'Product Name', 'Unit Price']]
result.to_csv('amazon_important_orders.csv', index=False)


