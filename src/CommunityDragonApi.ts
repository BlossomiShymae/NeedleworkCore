import axios from "axios";
import type { ResponseType } from "axios";
import SummonerEmote from "./SummonerEmote";

export default class CommunityDragonApi {
  private url: string = "https://raw.communitydragon.org";

  constructor() {
    this.getRequest = this.getRequest.bind(this);
    this.listSummonerEmotes = this.listSummonerEmotes.bind(this);
  }

  get defaultUri() {
    return "/latest/plugins/rcp-be-lol-game-data/global/default";
  }

  async getSummonerEmoteImageBytes(uri: string) {
    const bytes = await this.getRequest(this.defaultUri + uri, "arraybuffer");
    return bytes;
  }

  async listSummonerEmotes(localeIdentifier: string) {
    const data = await this.getRequest(`/latest/plugins/rcp-be-lol-game-data/global/${localeIdentifier}/v1/summoner-emotes.json`);
    return data.map((x: any) => SummonerEmote.fromJson(x));
  }

  async getRequest(url: string, type?: ResponseType) {
    const res = await axios.get(encodeURI(this.url + url), {
      responseType: type ?? "json"
    });
    const { data, status } = res;
    if (status >= 200 && status < 300) return data;

    throw new Error("Request was not successful: " + status);
  }
}