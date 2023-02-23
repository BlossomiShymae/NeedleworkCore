import CommunityDragonApi from "./CommunityDragonApi.js";
import LocaleIdentifiers from "./LocaleIdentifiers.js";

const api = new CommunityDragonApi();

const emotes = await api.listSummonerEmotes(LocaleIdentifiers.jaJP);
const emote = emotes[10];
console.log(emote);
console.log(emote.uri);

const bytes = await api.getSummonerEmoteImageBytes(emote.uri);
console.log(bytes);