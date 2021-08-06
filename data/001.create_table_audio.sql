DROP TABLE IF EXISTS audio;

CREATE TABLE audio (
    id SERIAL NOT NULL PRIMARY KEY,
    url TEXT,
    content TEXT,
    type VARCHAR(20),
    size INTEGER,
    duration INTEGER
);
