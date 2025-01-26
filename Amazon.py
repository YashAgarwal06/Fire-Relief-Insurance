import zipfile
import pandas as pd
from dotenv import load_dotenv
from openai import AzureOpenAI
import os
from pathlib import Path

def process_amazon_data(zip_path):
    # Extract the folder name from the zip_path (e.g., 'YashAmazon' from 'Bank Data/YashAmazon.zip')
    zip_name = Path(zip_path).stem  # Extracts 'YashAmazon' from 'YashAmazon.zip'
    output_folder = zip_name  # Set output_folder to the extracted name

    # Construct paths for returns_file_path and return_quantity_file_path
    returns_file_path = os.path.join(output_folder, 'Retail.OrdersReturned.Payments.1', 'Retail.OrdersReturned.Payments.1.csv')
    return_quantity_file_path = os.path.join(output_folder, 'Retail.OrdersReturned.1', 'Retail.OrdersReturned.1.csv')

    # Unzip the file
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(output_folder)
    
    folder_path = os.path.join(output_folder, 'Retail.OrderHistory.1')

    if os.path.exists(folder_path):
        csv_path = os.path.join(folder_path, 'Retail.OrderHistory.1.csv')

        if os.path.exists(csv_path):
            data = pd.read_csv(csv_path)
        else:
            print("File not found")
            return None
    else:
        print("File not found")
        return None

    returns_data = pd.read_csv(returns_file_path)
    return_quantity_data = pd.read_csv(return_quantity_file_path).drop_duplicates()

    # Ensure 'Total Owed' is numeric to avoid type issues
    data['Total Owed'] = pd.to_numeric(data['Total Owed'], errors='coerce')

    data = data[['Order ID', 'Order Date', 'Total Owed', 'Quantity', 'Product Name']]
    data = data.loc[data['Quantity'] != 0]
    
    # Convert 'Order Date' to datetime and then format it as 'YYYY-DD-MM'
    data['Order Date'] = pd.to_datetime(data['Order Date']).dt.strftime('%Y-%d-%m')


    returns_subset = returns_data[['OrderID', 'AmountRefunded']].rename(columns={'OrderID': 'Order ID'})
    return_quantity = return_quantity_data[['OrderID', 'Quantity']].rename(columns={'OrderID': 'Order ID'})

    # Perform an inner merge to find matching rows based on the two conditions
    matching_rows = pd.merge(
        data,
        returns_subset.rename(columns={'AmountRefunded': 'Total Owed'}),
        on=['Order ID'],
        how='inner'
    )

    # Filter rows where 'Total Owed' in data matches 'AmountRefunded' in returns_subset
    matching_rows = matching_rows[matching_rows['Total Owed_x'] == matching_rows['Total Owed_y']]

    # Remove matching rows from `data`
    data = data[~data['Order ID'].isin(matching_rows['Order ID']) | 
                ~data['Total Owed'].isin(matching_rows['Total Owed_x'])]

    data['Total Owed'] = pd.to_numeric(data['Total Owed'], errors='coerce')
    filtered_data = data[data['Total Owed'] > 70] 
    result = filtered_data[['Order Date', 'Product Name', 'Total Owed']]

    print(result)
    # GPT processing
    load_dotenv()
    API_KEY = os.getenv('API_KEY')

    client = AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"), 
        api_key=os.getenv("API_KEY"),  
        api_version=os.getenv("API_VERSION")
    )

    item_list = result.to_csv(index=False)

    response = client.chat.completions.create(
        model=os.getenv('MODEL'),
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an insurance claims analyst specializing in comprehensive household inventory reconstruction. "
                    "Analyze Amazon purchase history with extreme diligence to identify ALL potential household items that would have been present during a fire. "
                    "Key categories to consider:\n"
                    "- Kitchen: Appliances, cookware, utensils, small electrics, food storage\n"
                    "- Furniture: Indoor/outdoor, all room types, mattresses\n"
                    "- Home Decor: Artwork, rugs, curtains, lamps, seasonal decorations\n"
                    "- Bed/Bath: Linens, towels, shower accessories, organizational items\n"
                    "- Cleaning: Appliances, tools, supplies\n"
                    "- Tools/Storage: Hardware, garage items, organizational systems\n"
                    "- Electronics: TVs, smart home devices, cables, peripherals\n"
                    "- Miscellaneous: Pet supplies, hobby items, sports equipment\n\n"
                    
                    "CSV Formatting Rules:\n"
                    "1. Use headers: Date Purchased,Category,Item Name,Purchase Price\n"
                    "2. Enclose any field containing commas in double quotes\n"
                    "3. Preserve original item names exactly\n"
                    "4. Include all price ranges from $0.99 to premium items\n\n"

                    "Inclusion Guidelines:\n"
                    "- Include even small/low-value household essentials (sponges, lightbulbs)\n"
                    "- Keep decorative/non-essential items (vases, picture frames)\n"
                    "- Include replacement items (if multiple of same category)\n"
                    "- Assume all items were present unless explicitly temporary"
                )
            },
            {
                "role": "user",
                "content": (
                    "Process this Amazon purchase history for total loss reconstruction:\n\n"
                    f"{item_list}\n\n"
                    "Return comprehensive CSV of household assets with these considerations:\n"
                    "1. Be inclusion-oriented - when uncertain, keep the item\n"
                    "2. Capture duplicates (e.g., multiple towel sets)\n"
                    "3. Include partially used consumables (cleaning supplies)\n"
                    "4. Preserve exact product names with special characters\n"
                    "5. Categorize items using detailed home inventory taxonomy"
                    "6. The CSV should neatly contain the dates, categories, item names, and price; don't add any extra cells or your own text; also remove the ```csv at the beginning and ``` at the end so the result should be everything betweeen those."
                )
            }
        ]
    )

    llm_filtered_items = response.choices[0].message.content

    # Return the CSV string directly
    return llm_filtered_items

# Example Implementation
#zip_path = 'Bank Data/YashAmazon.zip'
#csv_string = process_amazon_data(zip_path)

#file_path = 'output.csv'

# Write the CSV string to the file
#with open(file_path, 'w') as file:
#    file.write(csv_string)



