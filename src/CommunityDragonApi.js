import axios from "axios";

export default class CommunityDragonApi {
  constructor() {
    this.url = "https://raw.communitydragon.org";

    this.getRequest = this.getRequest.bind(this);
    this.getSummonerEmotesTranslation = this.getSummonerEmotesTranslation.bind(this);
  }

  async getSummonerEmotesTranslation(localeIdentifier) {
    if (localeIdentifier == null) throw new Error("Language tag must be defined ('default', 'en_us'...)");

    const emotes = await this.getRequest(`/latest/plugins/rcp-be-lol-game-data/global/${localeIdentifier}/v1/summoner-emotes.json`);
    return emotes;
  }

  async getRequest(url) {
    if (url == null) throw new Error("Url must be defined");

    const res = await axios.get(encodeURI(this.url + url));
    const { data, status } = res;
    if (status >= 200 && status < 300) return data;

    throw new Error("Request was not successful: " + status);
  }
}