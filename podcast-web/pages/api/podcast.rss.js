import Axios from 'axios';
import { writeFileSync } from 'fs';

export default async (req, res) => {
  const rss = await generateRss();
  writeFileSync('public/podcast.rss', rss, 'utf8');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/rss+xml');
  res.send(rss);
};

/**
 * @returns {Promise<string>}
 */
async function generateRss() {
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Hacker News Podcast</title>
    <googleplay:owner>poulad.pld@gmail.com</googleplay:owner>
    <googleplay:author>Poulad Ashrafpour</googleplay:author>
    <description>Hacker News articles of the day transformed to podcasts via speech synthesis.</description>
    <googleplay:image href="https://hacker-news-podcast.vercel.app/logo.png"/>
    <language>en-us</language>
    <link>https://hacker-news-podcast.vercel.app/</link>
    <itunes:explicit>no</itunes:explicit>
    <itunes:image href="https://hacker-news-podcast.vercel.app/logo.png"/>
    {{ITEMS}}
  </channel>
</rss>`;

  const episodes = await getEpisodes();
  const items = episodes
    .map(
      (e) => `
    <item>
      <title>${e.title}</title>
      <description>${e.description || ''}</description>
      <pubDate>Sat, 14 Nov 2020 00:09:00 GMT</pubDate>
      <enclosure url="${e.audio.url}" type="${e.audio.format}" length="${
        e.audio.size
      }"/>
      <itunes:duration>${e.duration}</itunes:duration>
      <itunes:image href="https://hacker-news-podcast.vercel.app/logo.png"/>
      <guid isPermaLink="false">${e.id}</guid>
    </item>
  `,
    )
    .join('');
  rss = rss.replace('{{ITEMS}}', items);
  return rss;
}

/**
 * @returns {Promise<any[]>}
 */
async function getEpisodes() {
  const resp = await Axios.get('api/episodes', {
    baseURL: 'https://hackernews-podcast.herokuapp.com',
  });
  return resp.data.data;
}
