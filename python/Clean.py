"""Cleans the raw data from the SQL query.
"""

# Dictionary with inflation adjusted rate for each year between 1996 and 2013
YEARS = {1996:1.46, 1997:1.43, 1998:1.4, 1999:1.38, 2000:1.33, 2001:1.3, 2002:1.28, 2003:1.25,
         2004:1.22, 2005:1.18, 2006:1.14, 2007:1.11, 2008:1.07, 2009:1.07, 2010:1.05,
         2011:1.02, 2012:1, 2013:1}

def clean(data, institutions):
    """Takes in rows from a database and returns the data
    in a cleaned JSON format.

    Args:
        data -- list of results from databse query
        institutions -- list of schools that appear in 2013

    Returns:
        final_json -- Dictionary with tree structure of data related to schools
    """
    json_data = {} # Inflation adjusted JSON structured tree about different institutions

    for inst in institutions:
        json_data[inst[0]] = {}

    for row in data:
        instnm = row[0]
        year = row[1]

        if instnm in json_data:
            financial_data = {}

            set_value(financial_data, 'tuition_in', row[2], year)
            set_value(financial_data, 'tuition_out', row[3], year)
            set_value(financial_data, 'debt_mdn', row[4], year)
            set_value(financial_data, 'mn_earn', row[5], year)
            set_value(financial_data, 'md_earn', row[6], year)
            """set_value(financial_data, 'md_earn_10', row[7], year)
            set_value(financial_data, 'md_earn_25', row[8], year)
            set_value(financial_data, 'md_earn_75', row[9], year)
            set_value(financial_data, 'md_earn_90', row[10], year)"""

            if len(financial_data) != 0:
                json_data[instnm][year] = financial_data

    avg = create_average_data(json_data)
    json_data['National Average'] = avg

    final_json = {'Contains':'schools data', 'features':[]}

    for school in json_data:
        json_entry = {'school': school, 'data': []}
        json_entry['school'] = school

        for year in json_data[school]:
            sub_entry = {'year': str(year), 'financial_data': json_data[school][year]}
            json_entry['data'].append(sub_entry)

        final_json['features'].append(json_entry)

    return final_json

def create_average_data(json_data):
    """

    Args:
        json_data -- School data in tree structure.
    Returns:
        dict -- Average of financial data across schools that provided data.
    """
    avg = {}
    counts = {}

    for school in json_data:

        for year in json_data[school]:
            if year < 2005:
                continue
            if year not in avg:
                avg[year] = json_data[school][year]
                counts[year] = {}
                for elem in json_data[school][year]:
                    counts[year][elem] = 1
            else:
                for elem in json_data[school][year]:
                    if elem not in avg[year]:
                        avg[year][elem] = json_data[school][year][elem]
                        counts[year][elem] = 1
                    else:
                        avg[year][elem] += json_data[school][year][elem]
                        counts[year][elem] += 1

    for year in avg:
        for elem in avg[year]:
            avg[year][elem] = avg[year][elem] / counts[year][elem]

    return avg

def set_value(data, key, value, year):
    """Sets the key in the dictionary data equal to the inflation adjusted value.
    """
    if value and value != 'PrivacySuppressed':
        data[key] = adjust_for_inflation(value, year)

def adjust_for_inflation(value, year):
    """Adjust the dollar value based on year. All values are for the value of the dollar in 2013.
    Source for inflation rates: http://www.bls.gov/data/inflation_calculator.htm

    Args:

    Returns:
        int -- Value for a year adjusted for inflation
    """
    return int(value * YEARS[year])
