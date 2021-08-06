DROP TABLE IF EXISTS episode;

CREATE TABLE episode (
    id SERIAL NOT NULL PRIMARY KEY,
    story_id INTEGER NOT NULL UNIQUE,
    title TEXT,
    description TEXT,
    image_url TEXT,
    audio_id INTEGER,
    published_at DATE
    ,
    CONSTRAINT fk_episode__audio_id
      FOREIGN KEY(audio_id)
      REFERENCES audio(id)
      ON DELETE SET NULL
      ON UPDATE CASCADE
);
