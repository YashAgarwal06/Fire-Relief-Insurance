import zipfile
from pathlib import Path
import os
import pandas as pd
import shutil

def process_zip_to_csv(filepath: str) -> str:
    output_folder = Path(filepath).stem
    with zipfile.ZipFile(filepath, 'r') as zip_ref:
        zip_ref.extractall(output_folder)

    try:
        returns_file_path = os.path.join(
            output_folder, 'Retail.OrdersReturned.Payments.1', 'Retail.OrdersReturned.Payments.1.csv')
        orders_file_path = os.path.join(
            output_folder, 'Retail.OrderHistory.1', 'Retail.OrderHistory.1.csv')
    except:
        raise Exception('Bad Amazon Order .zip file')

    orders_data = pd.read_csv(orders_file_path)
    returns_data = pd.read_csv(returns_file_path)

    orders_data['Total Owed'] = pd.to_numeric(
        orders_data['Total Owed'], errors='coerce')
    orders_data = orders_data[[
        'Order ID', 'Order Date', 'Unit Price', 'Total Owed', 'Quantity', 'Product Name']]
    orders_data = orders_data.loc[orders_data['Quantity'] != 0]
    orders_data['Order Date'] = pd.to_datetime(
        orders_data['Order Date']).dt.strftime('%Y-%d-%m')
    returns_subset = returns_data[['OrderID', 'AmountRefunded']].rename(
        columns={'OrderID': 'Order ID'})
    # Perform an inner merge to find matching rows based on the two conditions
    matching_rows = pd.merge(
        orders_data,
        returns_subset.rename(columns={'AmountRefunded': 'Total Owed'}),
        on=['Order ID'],
        how='inner'
    )
    # Filter rows where 'Total Owed' in data matches 'AmountRefunded' in returns_subset
    matching_rows = matching_rows[matching_rows['Total Owed_x']
        == matching_rows['Total Owed_y']]
    # Remove matching rows from `data`
    orders_data = orders_data[~orders_data['Order ID'].isin(matching_rows['Order ID']) |
                                ~orders_data['Total Owed'].isin(matching_rows['Total Owed_x'])]

    # Ensure 'Unit Price' and 'Quantity' columns are numeric
    orders_data['Unit Price'] = pd.to_numeric(
        orders_data['Unit Price'], errors='coerce')
    orders_data['Quantity'] = pd.to_numeric(
        orders_data['Quantity'], errors='coerce')

    # Calculate 'Total Price' by multiplying 'Unit Price' and 'Quantity'
    orders_data['Total Price'] = orders_data['Unit Price'] * \
        orders_data['Quantity']

    filtered_data = orders_data[orders_data['Total Owed'] > 70]
    result = filtered_data[['Order Date',
        'Quantity', 'Product Name', 'Total Owed']]

    item_list = result.to_csv(index=False)
    
    # delete unzipped files
    shutil.rmtree(output_folder)
    
    return item_list
