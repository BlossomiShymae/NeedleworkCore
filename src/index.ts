import { Command } from "commander";
import fs from "fs/promises";
import jsonDiff from "json-diff";
import { createLogger } from "@cuppachino/logger";

import CommunityDragonApi from "./CommunityDragonApi";
import LocaleIdentifiers from "./LocaleIdentifiers";
import { HallowedSummonerEmote, SummonerEmote } from "./models";

const logger = createLogger("Needlework");
logger.tag('Core', 'blue', 'bold');

const program = (new Command())
  .option('-d, --diff', "compare data and generate JSON diff files");
program.parse();
const { diff } = program.opts();

logger.log("Getting summoner emote metadatas from CommunityDragon...");
const api = new CommunityDragonApi();
const localeMap = await useLocaleMap(api);

logger.log("Processing hallowed summoner emotes...");
const hallowedSummonerEmoteMap = await useHallowedSummonerEmoteMap(localeMap);

logger.log("Preparing to serialize hallowed summoner emotes...");
const hallowedEmotes = Array
  .from(hallowedSummonerEmoteMap, ([name, value]) => value)
  .sort((a, b) => a.id - b.id);

const path = "hallowed-summoner-emotes.json";
let isUpdated = false;
if (diff) isUpdated = await compareAndDiff(hallowedEmotes, path);

const serializedEmotes = JSON.stringify(hallowedEmotes, null, 2);
await fs.writeFile(path, serializedEmotes);

// 0  - success, no updates
// 100 - success, data updated
process.exit(!isUpdated ? 0 : 100);

/**
 * Get all summoner-emotes.json files from CommunityDragon
 */
async function useLocaleMap(api: CommunityDragonApi) {
  const localeMap = new Map();
  for (const locale of Object.values(LocaleIdentifiers)) {
    const emotes = await api.listSummonerEmotes(locale);
    localeMap.set(locale, emotes);
  }

  return localeMap;
}

/**
 * Use hallowed summoner emote map with locales
 * @param localeMap 
 */
async function useHallowedSummonerEmoteMap(localeMap: Map<any, any>) {
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

  return hallowedSummonerEmoteMap;
}

/**
 * Compare, difference, and serialize changes in hallowed summoner emotes
 * @param hallowedEmotes 
 * @param path 
 */
async function compareAndDiff(hallowedEmotes: HallowedSummonerEmote[], path: string): Promise<boolean> {
  let isUpdated = false;
  try {
    const previousHallowedEmotes = JSON.parse(await fs.readFile(path, "utf8"));
    logger.log("Comparing differences. This may take a while...");
    const diff = jsonDiff.diff(previousHallowedEmotes, hallowedEmotes);
    if (diff != null) {
      const unixTimestamp = Date.now() / 1000;
      const diffPath = `${unixTimestamp}-diff-${path}`;
      logger.log("Writing diff file as changes were detected...");
      fs.writeFile(diffPath, JSON.stringify(diff));
      isUpdated = true;
    } else { logger.log("No changes were detected..."); }
  } catch (e: any) { logger.log("No emotes file was found to compare with...")}

  return isUpdated;
}