import requests
from bs4 import BeautifulSoup
import psycopg2
from City import City
from Country import Country


def scrape_countries():
    """
        Scrapes the main page for a list of every country available. Then
        creates an object for each country, and returns a list of all
        objects.
    """

    # get HTML from page
    url = "https://www.numbeo.com/taxi-fare/"
    text = requests.get(url=url).text

    # get links to the webpage of each city
    soup = BeautifulSoup(text, 'html.parser')
    links = soup.find_all('a')
    links = list(filter(lambda link: link.get('href')[0] == 'c', links))

    # iterate through links and generate a list of countries
    countries = []
    for link in links:
        country_name = link.getText()
        country_url = link.get('href')
        country = Country(country_name, country_url)
        countries.append(country)

    print("Scraped country data.")
    return countries


def scrape_cities(country):
    """
        Given a country object, scrapes the name, taxi start, taxi fare per
        km, and the currency for the country. This data is all stored in a
        City object, which gets appended to the cities list of the
        country's object
    """

    country_text = requests.get(url=country.url).text
    country_soup = BeautifulSoup(country_text, 'html.parser')
    cities = country_soup.find_all('tr')[2:]  # [2:] since 2 default td's

    # Get data from each city
    for city_text in cities:
        city_soup = BeautifulSoup(str(city_text), 'html.parser')
        rows = city_soup.find_all('td')

        name = rows[0].getText()
        taxi_start = rows[1].getText().split()[0]
        last_row = rows[2].getText().split()
        taxi_perkm = last_row[0]
        currency = last_row[1]

        country.add_city(City(name, taxi_start, taxi_perkm, currency))

    print("Scraped city data.")


def upload(countries):
    """
        Uploads data to the postgresql database
    """

    conn = None
    try:
        # connect to the PostgreSQL server
        print("Connecting to server")
        conn = psycopg2.connect(
            "dbname=taxifaretracker user=andrew password=")

        cur = conn.cursor()

        # reset table
        cur.execute("DROP TABLE taxifares;")
        cur.execute("""
            CREATE TABLE taxifares
            (
                id BIGSERIAL NOT NULL PRIMARY KEY,
                country VARCHAR(30) NOT NULL,
                city VARCHAR(30) NOT NULL,
                taxistart NUMERIC(10, 2) NOT NULL,
                taxiperkm NUMERIC(10, 2) NOT NULL,
                currency VARCHAR(10) NOT NULL
            );
        """)

        for country in countries:
            for city in country.cities:
                cur.execute("""
                    INSERT INTO taxifares 
                    (
                        country, 
                        city, 
                        taxistart, 
                        taxiperkm, 
                        currency
                    )
                    VALUES (%s, %s, %s, %s, %s);
                    """,
                            (
                                country.name,
                                city.name,
                                city.taxi_start,
                                city.taxi_perkm,
                                city.currency
                            )
                            )

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('DB Conn closed.')


countries = scrape_countries()
for country in countries:
    scrape_cities(country)
upload(countries)
