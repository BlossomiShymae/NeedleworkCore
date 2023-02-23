import axios from "axios";
import SummonerEmote from "./SummonerEmote.js";

export default class CommunityDragonApi {
  constructor() {
    this.url = "https://raw.communitydragon.org";

    this.getRequest = this.getRequest.bind(this);
    this.listSummonerEmotes = this.listSummonerEmotes.bind(this);
  }

  get defaultUri() {
    return "/latest/plugins/rcp-be-lol-game-data/global/default";
  }

  async getSummonerEmoteImageBytes(uri) {
    if (uri == null) throw new Error("Id must be defined");

    const bytes = await this.getRequest(this.defaultUri + uri, "arraybuffer");
    return bytes;
  }

  async listSummonerEmotes(localeIdentifier) {
    if (localeIdentifier == null) throw new Error("Language tag must be defined ('default', 'en_us'...)");

    const data = await this.getRequest(`/latest/plugins/rcp-be-lol-game-data/global/${localeIdentifier}/v1/summoner-emotes.json`);
    return data.map((x) => SummonerEmote.fromJson(x));
  }

  async getRequest(url, type) {
    if (url == null) throw new Error("Url must be defined");

    const res = await axios.get(encodeURI(this.url + url), {
      responseType: type ?? "json"
    });
    const { data, status } = res;
    if (status >= 200 && status < 300) return data;

    throw new Error("Request was not successful: " + status);
  }
}