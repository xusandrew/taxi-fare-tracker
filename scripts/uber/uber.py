from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By

import psycopg2

# start up selenium
options = webdriver.ChromeOptions()
options.add_argument('--no-sandbox')
options.add_argument('--window-size=1920,1080')
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--ignore-ssl-errors=yes')
options.add_argument('--ignore-certificate-errors')
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Remote(
    command_executor='http://selenium:4444',
    options=options
)


def get_data():
    '''Get data about cities from database'''
    results = []

    conn = None
    try:
        # connect to the PostgreSQL server
        print("Uber: Connecting")
        conn = psycopg2.connect(
            database="postgres",
            user="postgres",
            password="postgres",
            host="faredata.c1rgmh92t4a4.us-east-1.rds.amazonaws.com",
            port="5432")
        print("Uber: Connected")

        cur = conn.cursor()

        # commands
        query = "SELECT city, airport, center FROM cities;"
        cur.execute(query)

        results = cur.fetchall()

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Uber: DB Conn closed')

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

    wait = WebDriverWait(driver, 30)
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
            'airporttocenter': airport_to_center,
            'centertoairport': center_to_airport
        }
    return output


def get_db_query(city, route_data):
    '''Return query to update values in database with values in data'''

    return ("""
        INSERT INTO uberfares
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
        print("Uber: Connecting")
        conn = psycopg2.connect(
            database="postgres",
            user="postgres",
            password="postgres",
            host="faredata.c1rgmh92t4a4.us-east-1.rds.amazonaws.com",
            port="5432")
        print("Uber: Connected")

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
            print('Uber: DB Conn closed')


city_data = get_data()
route_data = find_prices(city_data)
upload(route_data)
driver.close()
driver.quit()
print("Uber: Finished")
