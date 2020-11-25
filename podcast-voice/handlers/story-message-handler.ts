import Axios from "axios";
import { CleanText } from "../models/clean-text";
import { Podcast } from "../models/podcast";
import { Message } from "../services/rabbitmq/message";
import { MessageHandler } from "../services/rabbitmq/message-handler";

export class StoryMessageHandler implements MessageHandler<Podcast> {
  constructor(private publishToTextsQueue: (p: Podcast) => void) {}

  handle(message: Message<Podcast>): void {
    this.extractTextFromArticle(message.payload.story.url)
      .then((text) => {
        this.publishToTextsQueue({ ...message.payload, text });
        message.acknowledge();
      })
      .catch((err) => {
        console.warn(`[processStoryMessage]: ERR!!`, err);
      });
  }

  private async extractTextFromArticle(url: string): Promise<CleanText> {
    // TODO handle rate limits. see https://extractarticletext.com/docs/#section/Overview/API-Key
    const apikey = `${process.env.EXTRACTOR_API_KEY}`;
    try {
      const resp = await Axios.get("extractor", {
        baseURL: "https://extractorapi.com/api/v1",
        params: { apikey, url },
      });
      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(
          `Error ${resp.status} ${resp.statusText} ${JSON.parse(resp.data)}`
        );
      }
    } catch (e) {
      console.log(e);
    }
  }
}
