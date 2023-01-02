import requests
from bs4 import BeautifulSoup
import psycopg2
from City import City
from Country import Country

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

# iterate through countries and get city data
for country in countries:
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

# put data in database
conn = None
try:
    # connect to the PostgreSQL server
    conn = psycopg2.connect(
        "dbname=taxifaretracker user=andrew password=")

    cur = conn.cursor()

    query = 0
    cur.execute()

    cur.close()
except (Exception, psycopg2.DatabaseError) as error:
    print(error)
finally:
    if conn is not None:
        conn.close()
        print('DB Conn closed.')
