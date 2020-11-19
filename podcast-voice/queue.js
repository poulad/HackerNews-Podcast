const Axios = require("axios");
const fs = require("fs");

const sentences = [
  `test 1.`,
  `and this is test two.`,
  //   `Other collaborative online encyclopedias were attempted before Wikipedia, but none were as successful.`,
  //   `Wikipedia began as a complementary project for Nupedia, a free online English-language encyclopedia project whose articles were written by experts and reviewed under a formal process.`,
  //   `It was founded on March 9, 2000, under the ownership of Bomis, a web portal company.`,
  //   `Its main figures were Bomis CEO Jimmy Wales and Larry Sanger, editor-in-chief for Nupedia and later Wikipedia.`,
  //   `Nupedia was initially licensed under its own Nupedia Open Content License, but even before Wikipedia was founded, Nupedia switched to the GNU Free Documentation License at the urging of Richard Stallman.`,
  //   `Wales is credited with defining the goal of making a publicly editable encyclopedia, while Sanger is credited with the strategy of using a wiki to reach that goal.`,
  //   `On January 10, 2001, Sanger proposed on the Nupedia mailing list to create a wiki as a "feeder" project for Nupedia.`,
  //   `Launch and early growth`,
  //   `The domains wikipedia.com and wikipedia.org were registered on January 12, 2001 and January 13, 2001 respectively, and Wikipedia was launched on January 15, 2001, as a single English-language edition at www.wikipedia.com, and announced by Sanger on the Nupedia mailing list`,
  //   `Wikipedia's policy of "neutral point-of-view" was codified in its first few months.`,
  //   `Otherwise, there were relatively few rules initially and Wikipedia operated independently of Nupedia.`,
  //   `Originally, Bomis intended to make Wikipedia a business for profit.`,
  //   `Wikipedia gained early contributors from Nupedia, Slashdot postings, and web search engine indexing.`,
  //   `Language editions were also created, with a total of 161 by the end of 2004.`,
  //   `Nupedia and Wikipedia coexisted until the former's servers were taken down permanently in 2003, and its text was incorporated into Wikipedia.`,
  //   `The English Wikipedia passed the mark of two million articles on September 9, 2007, making it the largest encyclopedia ever assembled, surpassing the Yongle Encyclopedia made during the Ming Dynasty in 1408, which had held the record for almost 600 years.`,
];

function concatenate(resultConstructor, ...arrays) {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new resultConstructor(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

async function getVoiceChunk(sentence, filename) {
  const resp = await Axios.default.get("http://localhost:5002/api/tts", {
    params: {
      text: sentence,
    },
    responseType: "arraybuffer",
  });
  if (resp.status === 200) {
    return resp.data;
  } else {
    console.error(`Failed. ${resp.status}`);
  }
}

async function main() {
  let buffer = new Uint8Array(0);

  for (let i = 0; i < sentences.length; i++) {
    const chunk = await getVoiceChunk(sentences[i], `wikipedia.wav`);
    buffer = concatenate(Uint8Array, buffer, chunk);
  }

  fs.writeFileSync("wikipedia.wav", buffer);
}

(async function () {
  try {
    await main();
  } catch (e) {
    console.error(` --> An error occured!`, e);
    process.exit(1);
  }
})();
