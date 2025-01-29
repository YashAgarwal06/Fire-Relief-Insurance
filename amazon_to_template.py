import pandas as pd
from datetime import datetime

def process_and_save_to_xlsx(output_xlsx_path, amazon_output):
    # Hardcoded file paths
    df_format_path = "PPCW-California.xlsm"
    output_csv_path = amazon_output

    # Load data
    df_format = pd.read_excel(df_format_path)
    output = pd.read_csv(output_csv_path)

    # Adjust df_format rows to match output rows
    output_rows = len(output) + 7  # Adding 7 for the title row
    df_format_rows = len(df_format)

    if output_rows > df_format_rows:
        additional_rows = output_rows - df_format_rows
        new_rows = pd.DataFrame(index=range(additional_rows), columns=df_format.columns)
        start_number = 5001
        new_rows.iloc[:, 0] = range(start_number, start_number + additional_rows)
        df_format = pd.concat([df_format, new_rows], ignore_index=True)
    elif output_rows < df_format_rows:
        df_format = df_format.iloc[:output_rows]

    # Function to populate data into df_format
    def populate_data(start_row, column_index, output_column):
        rows_to_fill = min(len(output), len(df_format) - start_row)
        df_format.iloc[start_row:start_row + rows_to_fill, column_index] = output.iloc[:rows_to_fill, output_column].values

    # Populate data into df_format
    populate_data(7, 4, 3)  # Populate column 5 with output column 4
    populate_data(7, 5, 1)  # Populate column 6 with output column 2
    populate_data(7, 10, 4)  # Populate column 11 with output column 5

    # Process dates
    dates = pd.to_datetime(output.iloc[:min(len(output), len(df_format) - 7), 0], format='%Y-%d-%m')
    current_date = datetime.now()

    years_diff = current_date.year - dates.dt.year
    months_diff = current_date.month - dates.dt.month

    adjust_years = (current_date.month < dates.dt.month) | ((current_date.month == dates.dt.month) & (current_date.day < dates.dt.day))
    years_diff[adjust_years] -= 1
    months_diff[adjust_years] += 12
    months_diff = months_diff % 12

    # Populate years and months
    rows_to_fill = min(len(dates), len(df_format) - 7)
    df_format.iloc[7:7 + rows_to_fill, 6] = years_diff[:rows_to_fill].values
    df_format.iloc[7:7 + rows_to_fill, 7] = months_diff[:rows_to_fill].values

    # Calculate sum and place it in the specified cell
    sum_value = df_format.iloc[7:, 10:].sum().sum()
    df_format.iat[5, 9] = sum_value

    # Populate the 10th column and 8th row with the division of the 5th column by the 2nd column in output
    if len(output) > 0:
        division_result = output.iloc[:, 4] / output.iloc[:, 1]  # 5th column divided by 2nd column
        df_format.iloc[7:7 + len(division_result), 9] = division_result.values  # Populate 10th column

    # Save the result to the specified output path
    df_format.to_excel(output_xlsx_path, index=False)

# Run the function

#process_and_save_to_xlsx("format.xlsx", "output.csv")