class Country:
    def __init__(self, name, url):
        self.name = name
        self.url = 'https://www.numbeo.com/taxi-fare/' + url
        self.cities = []

    def add_city(self, city):
        self.cities.append(city)
