from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

inputs = [
    [['Toronto Pearson International Airport (YYZ), 3111 Convair Dr, Mississauga, Ontario L4W 1S9, Canada'],
     ['Toronto, Ontario, Canada']],
    []
]

# start up selenium
options = Options()
# options.headless = True
driver = webdriver.Chrome(service=ChromeService(
    ChromeDriverManager().install()), options=options)


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


price = scrape_links(inputs[0][0], inputs[0][1])

driver.quit()
