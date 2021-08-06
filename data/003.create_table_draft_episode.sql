DROP TABLE IF EXISTS draft_episode;

CREATE TABLE draft_episode (
    episode_id INTEGER NOT NULL PRIMARY KEY,
    title TEXT,
    description TEXT,
    image_url TEXT,
    audio_id INTEGER
    ,
    CONSTRAINT fk_draft_episode__episode_id
      FOREIGN KEY(episode_id)
      REFERENCES episode(id)
      ON DELETE SET NULL
      ON UPDATE CASCADE
    ,
    CONSTRAINT fk_draft_episode__audio_id
      FOREIGN KEY(audio_id)
      REFERENCES audio(id)
      ON DELETE SET NULL
      ON UPDATE CASCADE
);
