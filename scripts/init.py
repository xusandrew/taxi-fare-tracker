import psycopg2
import time


def init():
    '''Add city to cities database'''
    conn = None
    try:
        # connect to the PostgreSQL server
        conn = psycopg2.connect(
            database="postgres", user="postgres", password="postgres", host="postgres", port="5432")
        print("Connected")

        cur = conn.cursor()

        # commands
        cur.execute('''CREATE TABLE IF NOT EXISTS uberfares 
        (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        city VARCHAR(50) NOT NULL,
        airportToCenter NUMERIC(10, 2) NOT NULL,
        centerToAirport NUMERIC(10, 2) NOT NULL,
        date TIMESTAMPTZ
        );

        CREATE TABLE IF NOT EXISTS lyftfares 
        (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        city VARCHAR(50) NOT NULL,
        airportToCenter NUMERIC(10, 2) NOT NULL,
        centerToAirport NUMERIC(10, 2) NOT NULL,
        date TIMESTAMPTZ
        );

        CREATE TABLE IF NOT EXISTS taxifares 
        (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        city VARCHAR(50) NOT NULL,
        taxistart NUMERIC(10, 2) NOT NULL,
        taxiperkm NUMERIC(10, 2) NOT NULL,
        date TIMESTAMPTZ
        );

        CREATE TABLE IF NOT EXISTS cities 
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
        );''')

        cur.close()
        conn.commit()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        time.sleep(1)
        print("Retry Connection")
        init()
    finally:
        if conn is not None:
            conn.close()
            print('DB Conn closed')
            quit()


init()
