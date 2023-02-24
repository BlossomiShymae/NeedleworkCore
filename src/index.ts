import fs from "fs/promises";
import jsonDiff from "json-diff";

import CommunityDragonApi from "./CommunityDragonApi";
import LocaleIdentifiers from "./LocaleIdentifiers";
import HallowedSummonerEmote from "./HallowedSummonerEmote";
import SummonerEmote from './SummonerEmote';

console.log("Processing...");

const api = new CommunityDragonApi();
const localeMap = new Map();

// Get all summoner-emotes.json files from CommunityDragon
console.info("Getting summoner emote metadatas from CommunityDragon...");
for (const locale of Object.values(LocaleIdentifiers)) {
  const emotes = await api.listSummonerEmotes(locale);
  localeMap.set(locale, emotes);
}

// Generate hallowed summoner emotes
console.info("Processing hallowed summoner emotes...");
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

// Compare, difference, and serialize hallowed summoner emotes
console.info("Preparing to serialize hallowed summoner emotes...");
const hallowedEmotes = Array
  .from(hallowedSummonerEmoteMap, ([name, value]) => value)
  .sort((a, b) => a.id - b.id);
const path = "hallowed-summoner-emotes.json";
let isUpdated = false;
try {
  const previousHallowedEmotes = JSON.parse(await fs.readFile(path, "utf8"));
  console.warn("Comparing differences. This may take a while...");
  const diff = jsonDiff.diff(previousHallowedEmotes, hallowedEmotes);
  if (diff != null) {
    const unixTimestamp = Date.now() / 1000;
    const diffPath = `${unixTimestamp}-diff-${path}`;
    console.info("Writing diff file as changes were detected...");
    fs.writeFile(diffPath, JSON.stringify(diff));
    isUpdated = true;
  } else { console.info("No changes were detected..."); }
} catch (e: any) { console.info("No emotes file was found to compare with...")}

const serializedEmotes = JSON.stringify(hallowedEmotes, null, 2);
await fs.writeFile(path, serializedEmotes);

// 0  - success, no updates
// 10 - success, data updated
process.exit(!isUpdated ? 0 : 100);