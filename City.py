class City:
    def __init__(self, name, taxi_start, taxi_perkm, currency):
        self.name = name
        self.taxi_start = float(taxi_start.replace(',', ''))
        self.taxi_perkm = float(taxi_perkm.replace(',', ''))
        self.currency = currency
