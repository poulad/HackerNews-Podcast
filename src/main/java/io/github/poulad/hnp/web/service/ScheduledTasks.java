package io.github.poulad.hnp.web.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class ScheduledTasks {
    @Autowired
    private StoriesService storiesService;

    @Scheduled(cron = "@midnight")
    public void publishTopHackerNewsStories() {

    }
}
