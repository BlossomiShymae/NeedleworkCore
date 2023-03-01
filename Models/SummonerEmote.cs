using System.Collections.Immutable;
using System.Text.RegularExpressions;

namespace Models;

public partial class SummonerEmote 
{
    public uint Id { get; set; }
    public string Name { get; set; } = "";
    public string InventoryIcon { get; set; } = "";
    public string Description { get; set; } = "";

    public string Uri 
    { 
        get 
        {
            if (string.IsNullOrEmpty(InventoryIcon)) return "";

            var split = InventoryIcon.Split("/lol-game-data/assets", StringSplitOptions.RemoveEmptyEntries);
            if (split.Length == 1) return split[0].ToLower();
            return "";
        }
    }

    public bool IsIcon 
    {
        get => string.IsNullOrEmpty(Uri) || Uri.Equals("/") ? false : true;
    }

    public string FileName 
    {
        get 
        {
            if (string.IsNullOrEmpty(InventoryIcon)) return "";

            var fileName = $"{InventoryIcon.Split("/").Last()}";
            var subnames = fileName.Split("_");
            if (subnames.First().Contains($"{Id}")) return fileName;
            return $"{Id}_{fileName}";
        }
    }

    public ImmutableList<string> Categories 
    {
        get 
        {
            if (!IsIcon) return ImmutableList<string>.Empty;

            var split = InventoryIcon
                .Split("/lol-game-data/assets/ASSETS/Loadouts/SummonerEmotes/", StringSplitOptions.RemoveEmptyEntries);
            var subsplit = split
                .First()
                .Replace("_", "")
                .Split("/", StringSplitOptions.RemoveEmptyEntries);
            
            var categories = new List<string>();
            foreach (var category in subsplit) 
            {
                if (!category.Contains(".png"))
                {
                    var regex = CategoryFilterRegex();
                    var formatted = regex.Split(category);
                    categories.Add(string.Join(" ", formatted));
                }
            }
            return categories.ToImmutableList();
        }
    }

    [GeneratedRegex("(?<=[A-Z])(?=[A-Z][a-z])|(?<=[^A-Z])(?=[A-Z])|(?<=[A-Za-z])(?=[^A-Za-z])")]
    private static partial Regex CategoryFilterRegex();
}