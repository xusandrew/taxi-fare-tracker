from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium import webdriver

from data import data

# start up selenium
options = Options()
driver = webdriver.Chrome(service=ChromeService(
    ChromeDriverManager().install()), options=options)


def scrape_coords(o_lat, o_long, d_lat, d_long):
    url = f'https://ride.lyft.com/ridetype?origin={o_lat}%2C{o_long}&destination={d_lat}%2C{d_long}&ride_type=&offerProductId=standard'
    driver.get(url)

    wait = WebDriverWait(driver, 10)
    prices = wait.until(EC.visibility_of_all_elements_located(
        (By.CLASS_NAME, 'vbjul')))

    price = prices[0].get_attribute('innerHTML')
    price_range = price[1:].split(' - ')
    price = (float(price_range[0]) + float(price_range[1]))/2
    print(price)


for city in data:
    coords = data[city]
    scrape_coords(coords['airport-lat'], coords['airport-long'],
                  coords['center-lat'], coords['center-long'])

driver.close()
