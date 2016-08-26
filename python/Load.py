"""Loads data from an SQLite3 database.
"""

import sqlite3

def load_data(path='../data/output/database.sqlite'):
    """Load data from college scorecard.

    Args:
        path -- path to SQLite3 Database (default '../data/output/database.sqlite')

    Returns:
        tuple -- (raw_data, institutions to include in final data set)
    """
    conn = sqlite3.connect(path)
    cursor = conn.cursor()

    # Gets financial data related to schools along with the year for the financail data
    query = """SELECT INSTNM, YEAR,
                    TUITIONFEE_IN, TUITIONFEE_OUT,
                    DEBT_MDN,
                    mn_earn_wne_p10, md_earn_wne_p10, pct10_earn_wne_p10, pct25_earn_wne_p10,
                    pct75_earn_wne_p10, pct90_earn_wne_p10
                 FROM Scorecard
                WHERE MAIN='Main campus'
                  AND PREDDEG = 'Predominantly bachelor''s-degree granting' """
    raw_data = execute(query, cursor)

    # Gets the schools that are main campuses, have predominantly bachelors students, and aren't
    # medical students
    query = """SELECT INSTNM
                 FROM Scorecard
                WHERE MAIN='Main campus'
                  AND PREDDEG = 'Predominantly bachelor''s-degree granting'
                  AND CCBASIC NOT LIKE '%Special%' """
    institutions = execute(query, cursor)

    return (raw_data, institutions)

def execute(sql, cursor):
    """Executes a SQL command on the cursor and returns the results."""
    cursor.execute(sql)
    return cursor.fetchall()
