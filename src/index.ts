import CommunityDragonApi from "./CommunityDragonApi";
import LocaleIdentifiers from "./LocaleIdentifiers";
import fs from "fs/promises";

const api = new CommunityDragonApi();
const localeMap = new Map();

// Get all summoner-emote.json files from CommunityDragon
for (const locale of Object.values(LocaleIdentifiers)) {
  const emotes = await api.listSummonerEmotes(locale);
  localeMap.set(emotes, locale);
  console.log([locale, emotes[0]]);
}

// Generate json file
// const needledSummonerEmotes = [];
// for (const [key, value] of localeMap) {
  
// }