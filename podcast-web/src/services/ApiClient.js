import Axios from "axios";

export default class ApiClient {
  static async createNewDraftEpisode(storyId) {
    await Axios.post('/api/drafts', {storyId})
  }
}