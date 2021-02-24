# Hacker News Podcast

<p align="center"><a href="https://hacker-news-podcast.vercel.app" target="_blank"><img src=".\podcast-web\public\hacker-news-podcast-repo.png" /></a></p>

Add to your pod catcher:

```text
https://hacker-news-podcast.vercel.app/api/podcast.rss
```

<!--

## TODO

- [ ] Find a way to run the Flask API backend. https://github.com/ripienaar/free-for-dev#paas

NOTES:


docker run --publish 5002:5002 --name tts --detach synesthesiam/mozillatts

docker logs --follow tts

docker rm -fv tts

docker run --rm --name hnp-elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.10.1

-->
