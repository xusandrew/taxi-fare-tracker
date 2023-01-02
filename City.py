class City:
    def __init__(self, name, taxi_start, taxi_perkm, currency):
        self.name = name
        self.taxi_start = int(taxi_start)
        self.taxi_perkm = int(taxi_perkm)
        self.currency = currency
