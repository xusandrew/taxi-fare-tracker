from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Options to change to headless mode in future
options = Options()
# options.headless = True
# options.add_argument("--window-size=1920,1200")

# Start webdriver and get main webpage
driver = webdriver.Chrome(options=options, service=Service(
    ChromeDriverManager().install()))
url = "https://www.numbeo.com/taxi-fare/"
driver.get(url)

# Locate links to the webpage of each city
links = driver.find_elements(by=By.XPATH, value='//td/a')

# Dictionary for the link to each country's page
countryLinks = {}
for a in links:
    countryLinks[a.text] = a.get_attribute("href")

# Scrape each country's page
for country in countryLinks:
    driver.get(countryLinks[country])


driver.quit()
