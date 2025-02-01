-- used for playwright testing
\c curbside_test;

INSERT INTO students (number, name, isloaded, time, added)
VALUES 
    ('1', 'Zogbert Xylophone', false, NULL, false),
    ('2', 'Blorpo McFizz', false, NULL, false),
    ('3', 'Quixley VonZoom', false, NULL, false),
    ('4', 'Snorp Jingleberry', false, NULL, false),
    ('5', 'Flibber McWobble', false, NULL, false);