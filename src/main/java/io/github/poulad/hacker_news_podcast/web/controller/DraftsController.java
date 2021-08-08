package io.github.poulad.hacker_news_podcast.web.controller;

import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("api/drafts")
public class DraftsController {

    @Async
    @GetMapping
    public CompletableFuture<String> get() {
        return CompletableFuture.completedFuture("Hello, World");
    }
}
