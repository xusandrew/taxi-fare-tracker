CREATE TABLE uberfares
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    airport VARCHAR(100) NOT NULL,
    center VARCHAR(100) NOT NULL,
    airportToCenter NUMERIC(10, 2),
    centerToAirport NUMERIC(10, 2)
);

INSERT INTO uberfares
    (city,
    airport,
    center
    )
VALUES
    ('Toronto', 'YYZ', 'Toronto, Ontario, Canada');

INSERT INTO uberfares
    (city,
    airport,
    center
    )
VALUES
    ('Vancouver', 'Vancouver International Airport (YVR), 3211 Grant McConachie Way, Richmond, British Columbia V7B 0A4, Canada', 'Vancouver');

