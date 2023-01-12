from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

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
        query = "SELECT city, airport, center FROM uberfares;"
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
            'airport': row[1],
            'center': row[2]
        }

    return output


def scrape_links(first, second):
    '''Takes in 2 strings for locations, one for each input
    on the page. Then submits these and returns cheapest price
    from the options.'''

    driver.get('https://uberfarefinder.com/')
    texts = driver.find_elements(By.CLASS_NAME, 'ng-empty')
    texts[0].send_keys(first)
    texts[1].send_keys(second)

    button = driver.find_element(By.ID, 'get-fare-button')
    button.click()

    wait = WebDriverWait(driver, 10)
    results = wait.until(EC.visibility_of_all_elements_located(
        (By.CSS_SELECTOR, '.text-right strong')))

    def getPrice(element):
        price = element.get_attribute('innerHTML')
        price = price[1:]
        return float(price)

    results = map(getPrice, results)
    return min(results)


def find_prices(data):
    '''Loops through all of the input data, and calls scrape_links
    for the two links. Then returns the prices from the airport to
    the city center, and from the city center back to the airport
    '''

    output = {}

    for (city_name, links) in data.items():
        airport_to_center = scrape_links(links['airport'], links['center'])
        center_to_airport = scrape_links(links['center'], links['airport'])

        output[city_name] = {
            'airport_to_center': airport_to_center,
            'center_to_airport': center_to_airport
        }
    return output


def get_db_query(city, city_data, route_data):
    '''Return query to update values in database with values in data'''

    return ("""
        INSERT INTO uberfares
        (
            city,
            airport,
            center,
            airporttocenter,
            centertoairport
        )
        VALUES ('{}','{}','{}',{},{});
        """.format(city,
                   city_data['airport'],
                   city_data['center'],
                   route_data['airport_to_center'],
                   route_data['center_to_airport']
                   ))


def upload(city_data, route_data):
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
                city_name, city_data[city_name], route_data[city_name])
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
upload(city_data, route_data)
driver.close()
