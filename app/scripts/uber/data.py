import psycopg2


def get_data():
    '''Get data about cities from database'''
    results = []

    conn = None
    try:
        # connect to the PostgreSQL server
        print("Connecting to server")
        conn = psycopg2.connect(
            database="taxifaretracker", user="andrew", password="")
        print("Connected")

        cur = conn.cursor()

        # commands
        query = "SELECT city, airport, center FROM uberfares;"
        cur.execute(query)

        results = cur.fetchall()

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('DB Conn closed')

    output = {}
    for row in results:
        output[row[0]] = {
            'airport': row[1],
            'center': row[2]
        }

    return output
