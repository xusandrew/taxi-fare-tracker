class Country:
    def __init__(self, name):
        self.name = name
        self.cities = []

    def add_city(self, city):
        self.cities.append(city)
