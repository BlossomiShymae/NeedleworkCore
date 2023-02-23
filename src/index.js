import CommunityDragonApi from "./CommunityDragonApi.js";
import LocaleIdentifiers from "./LocaleIdentifiers.js";

const api = new CommunityDragonApi();

const emotes = await api.getSummonerEmotesTranslation(LocaleIdentifiers.jaJP);
console.log(emotes);