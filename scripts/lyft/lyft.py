from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium import webdriver
import psycopg2

# start up selenium
options = Options()
options.headless = True
driver = webdriver.Chrome(service=ChromeService(
    ChromeDriverManager().install()), options=options)


def get_data():
    '''Get data about cities from database'''
    results = []

    conn = None
    try:
        # connect to the PostgreSQL server
        print("Connecting to server")
        conn = psycopg2.connect(
            database="taxifaretracker", user="andrew", password="")
        print("Connected")

        cur = conn.cursor()

        # commands
        query = "SELECT city, airportLat, airportLong, centerLat, centerLong FROM cities;"
        cur.execute(query)

        results = cur.fetchall()

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('DB Conn closed')

    output = {}
    for row in results:
        output[row[0]] = {
            'airportLat': row[1],
            'airportLong': row[2],
            'centerLat': row[3],
            'centerLong': row[4]
        }

    return output


def scrape_coords(o_lat, o_long, d_lat, d_long):
    '''Takes in coordinates of the origin and destination and requests
    and generates a link to request to the lyft website. Then takes
    result from the request and returns the price
    '''

    url = f'https://ride.lyft.com/ridetype?origin={o_lat}%2C{o_long}&destination={d_lat}%2C{d_long}&ride_type=&offerProductId=standard'
    driver.get(url)

    wait = WebDriverWait(driver, 10)
    prices = wait.until(EC.visibility_of_all_elements_located(
        (By.CLASS_NAME, 'vbjul')))

    price = prices[0].get_attribute('innerHTML')
    price_range = price[1:].split(' - ')
    price = (float(price_range[0]) + float(price_range[1]))/2
    return price


def find_prices(data):
    '''Loops through each city and determines the prices from the airport
    to city-center and vice versa.
    '''

    output = {}
    for (city_name, coords) in data.items():
        airport_to_center = scrape_coords(coords['airportLat'], coords['airportLong'],
                                          coords['centerLat'], coords['centerLong'])
        center_to_airport = scrape_coords(coords['centerLat'], coords['centerLong'],
                                          coords['airportLat'], coords['airportLong'])

        output[city_name] = {
            'airporttocenter': airport_to_center,
            'centertoairport': center_to_airport
        }
    return output


def get_db_query(city, route_data):
    '''Return query to update values in database with values in data'''
    return ("""
        INSERT INTO lyftfares 
        (
            city, 
            airporttocenter,
            centertoairport
        )
        VALUES ('{}',{},{});
        """.format(city,
                   route_data['airporttocenter'],
                   route_data['centertoairport']
                   ))


def upload(route_data):
    '''Upload data generated from find_prices() to PSQL database'''

    conn = None
    try:
        # connect to the PostgreSQL server
        print("Connecting to server")
        conn = psycopg2.connect(
            database="taxifaretracker", user="andrew", password="")
        print("Connected")

        cur = conn.cursor()

        # commands
        for city_name in route_data:
            query = get_db_query(
                city_name, route_data[city_name])
            cur.execute(query)

        cur.close()
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('DB Conn closed')


city_data = get_data()
route_data = find_prices(city_data)
upload(route_data)
driver.close()
