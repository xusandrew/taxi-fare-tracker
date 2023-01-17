import psycopg2


def upload(data):
    '''Add city to cities database'''

    conn = None
    try:
        # connect to the PostgreSQL server
        print("Connecting to server")
        conn = psycopg2.connect(
            database="postgres",
            user="postgres",
            password="postgres",
            host="faredata.c1rgmh92t4a4.us-east-1.rds.amazonaws.com",
            port="5432")
        print("Connected")

        cur = conn.cursor()

        # commands
        cur.execute('''INSERT INTO cities
        (
            country,
            city,
            currency,
            airport,
            center,
            airportLat,
            airportLong,
            centerLat,
            centerLong
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);''',
                    (
                        data['country'],
                        data['city'],
                        data['currency'],
                        data['airport'],
                        data['center'],
                        data['airportLat'],
                        data['airportLong'],
                        data['centerLat'],
                        data['centerLong']
                    ))

        cur.close()
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('DB Conn closed')


data = {
    'country': 'Canada',
    'city': 'Brampton',
    'currency': '$ CAD',
    'airport': 'YYZ',
    'center': 'Brampton',
    'airportLat': 43.688442230,
    'airportLong': -79.62175750,
    'centerLat': 43.68432235,
    'centerLong': -79.7595596
}

# data = {
#     'country': 'Canada',
#     'city': 'Vancouver',
#     'currency': '$ CAD',
#     'airport': 'YVR',
#     'center': 'Vancouver',
#     'airportLat': 49.193506,
#     'airportLong': -123.180405,
#     'centerLat': 49.256538,
#     'centerLong': -123.101997
# }

upload(data)
