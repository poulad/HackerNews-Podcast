import Axios from "axios";
import {Config} from "../config";

export default class ApiClient {

  constructor({baseUrl}) {
    this.baseUrl = baseUrl || ''
  }

  static forServerApp() {
    return new ApiClient({baseUrl: Config.apiBaseUrl})
  }

  static forClientApp() {
    return new ApiClient({})
  }

  async createNewDraftEpisode(storyId) {
    await Axios.post(`${this.baseUrl}/api/drafts`, {storyId})
  }

  async getDraftEpisode(storyId) {
    const resp = await Axios.get(`${this.baseUrl}/api/drafts/${storyId}`, {
      validateStatus: () => true
    })
    return resp.data
  }
}