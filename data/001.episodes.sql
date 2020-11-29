DROP TABLE IF EXISTS episode;

CREATE TABLE episode (
    id SERIAL NOT NULL PRIMARY KEY,
    story_id INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    audio_url TEXT,
    audio_content TEXT,
    audio_type VARCHAR(20),
    audio_size INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    published_at DATE NOT NULL
);