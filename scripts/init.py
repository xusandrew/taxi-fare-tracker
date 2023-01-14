import psycopg2


'''Add city to cities database'''

conn = None
try:
    # connect to the PostgreSQL server
    print("Connecting to server")
    conn = psycopg2.connect(
        database="postgres", user="postgres", password="postgres", host="postgres", port="5432")
    print("Connected")

    cur = conn.cursor()

    # commands
    cur.execute('''CREATE TABLE uberfares 
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    airportToCenter NUMERIC(10, 2) NOT NULL,
    centerToAirport NUMERIC(10, 2) NOT NULL,
    date TIMESTAMPTZ
);

CREATE TABLE lyftfares 
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    airportToCenter NUMERIC(10, 2) NOT NULL,
    centerToAirport NUMERIC(10, 2) NOT NULL,
    date TIMESTAMPTZ
);

CREATE TABLE taxifares 
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    taxistart NUMERIC(10, 2) NOT NULL,
    taxiperkm NUMERIC(10, 2) NOT NULL,
    date TIMESTAMPTZ
);

CREATE TABLE cities 
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    country VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    airport VARCHAR(100) NOT NULL,
    center VARCHAR(100) NOT NULL,
    airportLat NUMERIC(15,10) NOT NULL,
    airportLong NUMERIC(15,10) NOT NULL,
    centerLat NUMERIC(15,10) NOT NULL,
    centerLong NUMERIC(15,10) NOT NULL
);

INSERT INTO cities
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
    )
VALUES
    (
        'Canada',
        'Toronto',
        '$ CAD',
        'YYZ',
        'Toronto, Ontario, Canada',
        43.6884422300,
        -79.6217575000,
        43.6479301400,
        -79.3847808800
);
''')

    cur.close()
    conn.commit()

except (Exception, psycopg2.DatabaseError) as error:
    print(error)
finally:
    if conn is not None:
        conn.close()
        print('DB Conn closed')
