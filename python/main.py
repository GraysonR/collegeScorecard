"""Main python script for cleaning College Scorecard data.
"""
import json

from Clean import clean
from Load import load_data


def export(data, path='../data/scorecard_data.json'):
    """Turn a python dictionary in JSON format into a JSON file.

    Args:
        data -- Tree structure of scorecard data.
        path -- Where to store file (default '../data/scorecard_data.json')
    """
    with open(path, 'w') as filepath:
        json.dump(data, filepath)

def main():
    """Loads, cleans, and exports college scorecard data."""
    data = load_data()
    data = clean(data[0], data[1])
    export(data)

if __name__ == "__main__":
    main()
