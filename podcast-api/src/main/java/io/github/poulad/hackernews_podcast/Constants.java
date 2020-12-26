package io.github.poulad.hackernews_podcast;

public final class Constants {
    public enum Queues {
        STORIES("stories"),
        TEXTS("texts"),
        AUDIOS("audios"),
        PODCASTS("podcasts"),
        ;

        private String name;

        Queues(String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }
    }
}
