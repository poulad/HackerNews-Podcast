export default class YCHNApiClient {

  static getStoryIdFromUrl(url) {
    const idPart = url.substring("https://news.ycombinator.com/item?id=".length)
    return parseInt(idPart)
  }

  static getStoryUrl(storyId) {
    return `https://news.ycombinator.com/item?id=${storyId}`
  }
}

