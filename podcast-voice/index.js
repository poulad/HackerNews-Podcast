const Axios = require("axios");
const fs = require("fs");
const child_process = require("child_process");
const util = require("util");

const episode = {
  id: "wiki-wikipedia",
  name: "The Wikipedia Wiki",
  sentences: [
    `Other collaborative online encyclopedias were attempted before Wikipedia, but none were as successful.`,
    `Wikipedia began as a complementary project for Nupedia, a free online English-language encyclopedia project whose articles were written by experts and reviewed under a formal process.`,
    `It was founded on March 9, 2000, under the ownership of Bomis, a web portal company.`,
    `Its main figures were Bomis CEO Jimmy Wales and Larry Sanger, editor-in-chief for Nupedia and later Wikipedia.`,
    `Nupedia was initially licensed under its own Nupedia Open Content License, but even before Wikipedia was founded, Nupedia switched to the GNU Free Documentation License at the urging of Richard Stallman.`,
    `Wales is credited with defining the goal of making a publicly editable encyclopedia, while Sanger is credited with the strategy of using a wiki to reach that goal.`,
    `On January 10, 2001, Sanger proposed on the Nupedia mailing list to create a wiki as a "feeder" project for Nupedia.`,
    `Launch and early growth.`,
    `The domains wikipedia-dot-com and wikipedia-dot-org were registered on January 12, 2001 and January 13, 2001 respectively, and Wikipedia was launched on January 15, 2001, as a single English-language edition at www-dot-wikipedia-dot-com, and announced by Sanger on the Nupedi a mailing list.`,
    `Wikipedia's policy of "neutral point-of-view" was codified in its first few months.`,
    `Otherwise, there were relatively few rules initially and Wikipedia operated independently of Nupedia.`,
    `Originally, Bomis intended to make Wikipedia a business for profit.`,
    `Wikipedia gained early contributors from Nupedia, Slashdot postings, and web search engine indexing.`,
    `Language editions were also created, with a total of 161 by the end of 2004.`,
    `Nupedia and Wikipedia coexisted until the former's servers were taken down permanently in 2003, and its text was incorporated into Wikipedia.`,
    `The English Wikipedia passed the mark of two million articles on September 9, 2007, making it the largest encyclopedia ever assembled, surpassing the Yongle Encyclopedia made during the Ming Dynasty in 1408, which had held the record for almost 600 years.`,
  ],
};

async function getVoiceChunk(sentence, filename) {
  const resp = await Axios.default.get("http://localhost:5002/api/tts", {
    params: {
      text: sentence,
    },
    responseType: "arraybuffer",
  });
  if (resp.status === 200) {
    fs.writeFileSync(filename, resp.data);
  } else {
    console.error(`Failed. ${resp.status}`);
  }
}

/**
 * @param {string[]} chunks
 */
async function combineVoiceChunks(chunks, output) {
  const cunksWithGaps = chunks
    .map((c) => [c, `./sln.wav`])
    .reduce((prev, curr) => [...prev, ...curr], []);
  const commandText = ["sox", ...chunks, output].map(JSON.stringify).join(" ");

  const exec = util.promisify(child_process.exec);
  const { stdout, stderr } = await exec(commandText);
}

async function main() {
  fs.mkdirSync(`episodes/${episode.id}/`, { recursive: true });
  const episodeChunkFiles = [];
  for (let i = 0; i < episode.sentences.length; i++) {
    episodeChunkFiles.push(`./episodes/${episode.id}/${i}.wav`);
    await getVoiceChunk(
      episode.sentences[i],
      episodeChunkFiles[episodeChunkFiles.length - 1]
    );
  }
  await combineVoiceChunks(
    episodeChunkFiles,
    `./episodes/${episode.id}/${episode.id}.wav`
  );
}

(async function () {
  try {
    await main();
  } catch (e) {
    console.error(` --> An error occured!`, e);
    process.exit(1);
  }
})();
