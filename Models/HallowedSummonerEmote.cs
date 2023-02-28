using System.Collections.Immutable;
using System.Text.Json.Serialization;

namespace Models;

public class HallowedSummonerEmote 
{
    [JsonPropertyName("id")]
    public uint Id { get; set; }
    [JsonPropertyName("inventoryIcon")]
    public string InventoryIcon { get; set; } = "";
    [JsonPropertyName("uri")]
    public string Uri { get; set; } = "";
    [JsonPropertyName("categories")]
    public ImmutableList<string> Categories { get; set; } = ImmutableList<string>.Empty;
    [JsonPropertyName("filename")]
    public string FileName { get; set; } = "";
    [JsonPropertyName("translations")]
    public Dictionary<string, EmoteTranslation> Translations { get; init; } = new();

    public static HallowedSummonerEmote FromSummonerEmote(SummonerEmote emote)
    {
        return new HallowedSummonerEmote
        {
            Id = emote.Id,
            InventoryIcon = emote.InventoryIcon,
            Uri = emote.Uri,
            Categories = emote.Categories,
            FileName = emote.IsIcon ? emote.FileName : "",
        };
    }
}

public class EmoteTranslation
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";
    [JsonPropertyName("description")]
    public string Description { get; set; } = "";
}
