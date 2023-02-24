export default class SummonerEmote {
  id: number;
  name: string;
  inventoryIcon: string;
  description: string;

  constructor({
    id, name, inventoryIcon, description
  }: IEmoteData) {
    this.id = id;
    this.name = name;
    this.inventoryIcon = inventoryIcon;
    this.description = description;
  }

  static fromJson(data: IEmoteData) {
    if (data == null) throw new Error("data must be defined");

    const emote = new SummonerEmote(data);
    return emote;
  }

  get uri() {
    const { inventoryIcon } = this;
    if (inventoryIcon == null) return "";

    const split = inventoryIcon.split("/lol-game-data/assets").filter(x => x);
    if (split.length == 1) return split[0].toLowerCase();

    return "";
  }

  get categories() {
    if (!this.isIcon) return [];

    const split = this.inventoryIcon.split("/lol-game-data/assets/ASSETS/Loadouts/SummonerEmotes/").filter(x => x);
    const subsplit = split[0].replace("_", "").split("/").filter(x => x);

    const categories = [];
    console.log(subsplit);
    for (const category of subsplit) {
      if (!category.includes(".png")) {
        const regex = /(?<=[A-Z])(?=[A-Z][a-z])|(?<=[^A-Z])(?=[A-Z])|(?<=[A-Za-z])(?=[^A-Za-z])/;
        const formatted = category.split(regex);
        if (formatted != null) categories.push(formatted[0]);
      }
    }
    console.log(categories);

    return categories;
  }

  get filename() {
    const { inventoryIcon } = this;
    if (inventoryIcon == null) return "";

    const filename = `${inventoryIcon.split("/").slice(-1)}`;
    const subnames = filename.split("_");
    if (subnames.slice(0, 1).includes(`${this.id}`)) return filename;
    return `${this.id}_${filename}`;
  }

  get isIcon() {
    return this.uri == null || this.uri == "" || this.uri == "/" ? false : true;
  }
}

interface IEmoteData {
  id: number;
  name: string;
  inventoryIcon: string;
  description: string;
}
