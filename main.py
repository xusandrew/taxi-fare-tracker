from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

options = Options()
# options.headless = True
# options.add_argument("--window-size=1920,1200")

driver = webdriver.Chrome(options=options, service=Service(
    ChromeDriverManager().install()))

url = "https://www.google.com"
driver.get(url)
