import CommunityDragonApi from "./CommunityDragonApi";
import LocaleIdentifiers from "./LocaleIdentifiers";
import fs from "fs/promises";
import HallowedSummonerEmote from "./HallowedSummonerEmote";
import SummonerEmote from './SummonerEmote';

console.log("Processing...");

const api = new CommunityDragonApi();
const localeMap = new Map();

// Get all summoner-emote.json files from CommunityDragon
for (const locale of Object.values(LocaleIdentifiers)) {
  const emotes = await api.listSummonerEmotes(locale);
  localeMap.set(locale, emotes);
}

// Generate hallowed summoner emotes
const hallowedSummonerEmoteMap = new Map<number, HallowedSummonerEmote>();
for (const [key, value] of localeMap) {
  const emotes = value as SummonerEmote[];
  for (const emote of emotes) {
    // Get hallowed emote
    let hallowedEmote = hallowedSummonerEmoteMap.get(emote.id);
    if (hallowedEmote == null) hallowedEmote = HallowedSummonerEmote.fromSummonerEmote(emote);

    // Set translatable meta information
    hallowedEmote.translations[key] = { 
      description: emote.description,
      name: emote.name
    };

    // Put hallowed emote back into map
    hallowedSummonerEmoteMap.set(emote.id, hallowedEmote);
  }
}

// Serialize hallowed summoner emotes
const hallowedEmotes = Array
  .from(hallowedSummonerEmoteMap, ([name, value]) => value)
  .sort((a, b) => a.id - b.id);
const serializedEmotes = JSON.stringify(hallowedEmotes, null, 2);
await fs.writeFile("hallowed-summoner-emotes.json", serializedEmotes);