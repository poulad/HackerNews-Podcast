package io.github.poulad.hackernews_podcast;

import lombok.NonNull;

public final class Constants {
    public enum Queues {
        STORIES("stories"),
        TEXTS("texts"),
        AUDIOS("audios"),
        PODCASTS("podcasts"),
        ;

        private final String name;

        Queues(@NonNull String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }
    }
}
