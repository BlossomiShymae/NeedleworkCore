import { Command } from "commander";
import fs from "fs/promises";
import fpath from "path";
import jsonDiff from "json-diff";
import { createLogger } from "@cuppachino/logger";

import CommunityDragonApi from "./CommunityDragonApi";
import LocaleIdentifiers from "./LocaleIdentifiers";
import { HallowedSummonerEmote, SummonerEmote } from "./models";

const logger = createLogger("Needlework");
logger.tag('Core', 'blue', 'bold');

const program = (new Command())
  .option('-d, --diff', "compare data and generate JSON diff files")
  .option('-g, --get', "get and download data images associated with metadata")
  .requiredOption('-p, --path <path>', "output path for folders and files");
program.parse();
const { diff, path, get } = program.opts();
console.log(program.opts());

let folderPath = path;
if (!fpath.isAbsolute(path)) folderPath = fpath.resolve(path);
const paths = {
  emotes: fpath.join(folderPath, "/Emotes")
};
for (const dir of Object.values(paths)) fs.mkdir(dir, { recursive: true });

logger.log("Getting summoner emote metadatas from CommunityDragon...");
const api = new CommunityDragonApi();
const localeMap = await useLocaleMap(api);

logger.log("Processing hallowed summoner emotes...");
const hallowedSummonerEmoteMap = await useHallowedSummonerEmoteMap(localeMap);

logger.log("Preparing to serialize hallowed summoner emotes...");
const hallowedEmotes = Array
  .from(hallowedSummonerEmoteMap, ([name, value]) => value)
  .sort((a, b) => a.id - b.id);

const filePath = "hallowed-summoner-emotes.json";
let isUpdated = false;
if (diff) isUpdated = await compareAndDiff(hallowedEmotes, filePath, paths.emotes);

const serializedEmotes = JSON.stringify(hallowedEmotes, null, 2);
if (!(await fileExists(fpath.join(paths.emotes, filePath)))) isUpdated = true;
await fs.writeFile(fpath.join(paths.emotes, filePath), serializedEmotes);

if (get) await downloadDataImages(api, hallowedEmotes, paths.emotes);

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
 * @param filePath 
 */
async function compareAndDiff(hallowedEmotes: HallowedSummonerEmote[], filePath: string, folderPath: string): Promise<boolean> {
  let isUpdated = false;
  try {
    const previousPath = fpath.join(folderPath, filePath);
    const previousFile = await fs.readFile(previousPath, "utf8");
    const previousHallowedEmotes = JSON.parse(previousFile);
    logger.log("Comparing differences. This may take a while...");
    const diff = jsonDiff.diff(previousHallowedEmotes, hallowedEmotes);
    if (diff != null) {
      const unixTimestamp = Date.now() / 1000;
      const diffPath = fpath.join(folderPath, `${unixTimestamp}-diff-${filePath}`);
      logger.log("Writing diff file as changes were detected...");
      fs.writeFile(diffPath, JSON.stringify(diff));
      isUpdated = true;
    } else { logger.log("No changes were detected..."); }
  } catch (e: any) { 
    logger.log("No emotes file was found to compare with...");
  }

  return isUpdated;
}

/**
 * Download data images from CommunityDragon.
 * @param hallowedEmotes 
 * @param folderPath 
 */
async function downloadDataImages(api: CommunityDragonApi, hallowedEmotes: HallowedSummonerEmote[], folderPath: string) {
  for (const emote of hallowedEmotes) {
    const imagePath = fpath.join(folderPath, emote.filename);

    if (emote.filename === "") continue;
    if (await fileExists(imagePath)) continue;

    const imageBytes = await api.getSummonerEmoteImageBytes(emote.uri);
    logger.log(`Writing file ${emote.filename}...`);
    fs.writeFile(fpath.join(folderPath, emote.filename), imageBytes);
  }
}

async function fileExists(filePath: string) {
  return !!(await fs.stat(filePath).catch(e => false));
}