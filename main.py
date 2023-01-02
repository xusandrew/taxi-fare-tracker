import requests
from bs4 import BeautifulSoup

# get HTML from page
url = "https://www.numbeo.com/taxi-fare/"
text = requests.get(url=url).text

# get links to the webpage of each city
soup = BeautifulSoup(text, 'html.parser')
links = soup.find_all('a')
links = map(lambda a: a.get('href'), links)
links = list(filter(lambda link: link[0] == 'c', links))
