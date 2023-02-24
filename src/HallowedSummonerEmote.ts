import SummonerEmote from './SummonerEmote';

export default class HallowedSummonerEmote {
  id: number;
  inventoryIcon: string;
  uri: string;
  categories: string[];
  filename: string;
  translations: ITranslations;

  constructor(props: IHallowedSummonerEmoteProps) {
    const { id, inventoryIcon, translations, uri, categories, filename } = props;
    this.id = id;
    this.inventoryIcon = inventoryIcon;
    this.uri = uri;
    this.categories = categories;
    this.filename = filename;
    this.translations = translations;
  }

  static fromSummonerEmote(emote: SummonerEmote): HallowedSummonerEmote {
    const hallowedSummonerEmote = new HallowedSummonerEmote({
      id: emote.id,
      inventoryIcon: emote.inventoryIcon,
      uri: emote.uri,
      categories: emote.categories,
      filename: emote.isIcon ? emote.filename : "",
      translations: {}
    });
    return hallowedSummonerEmote;
  }
}

interface IHallowedSummonerEmoteProps {
  id: number;
  inventoryIcon: string;
  uri: string;
  categories: string[];
  filename: string;
  translations: ITranslations
}

interface ITranslations { 
  [localeIdentifier: string]: { name: string, description: string};
}