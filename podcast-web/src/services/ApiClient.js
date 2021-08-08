import Axios from "axios";

export default class ApiClient {
  static async createNewDraftEpisode(storyId) {
    await Axios.post('https://hackernews-podcast.herokuapp.com/api/drafts', {storyId})
  }
}