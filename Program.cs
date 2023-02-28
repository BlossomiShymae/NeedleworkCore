
using System.Data;
using System.Text.Encodings.Web;
using System.Text.Json;
using JsonDiffPatchDotNet;
using Mappers;
using McMaster.Extensions.CommandLineUtils;
using Models;
using Services;

var app = new CommandLineApplication();

app.HelpOption();

var diff = app.Option("-d|--diff", "Compare data and generate JSON diff files.", CommandOptionType.NoValue);
var get = app.Option("-g|--get", "Download data images associated with metadata.", CommandOptionType.NoValue);
var path = app.Option("-p|--path <path>", "Output path for files and folders. Current working path will be used as default.", CommandOptionType.SingleValue);
path.DefaultValue = string.Empty;

app.OnExecuteAsync(async cancellationToken =>
{
    await Main();
    return 0;
});

return app.Execute(args);

async Task Main()
{
    var summonerEmoteService = new SummonerEmoteService();
    var localeIdentifierMapper = new LocaleIdentifierMapper();
    var hallowedEmoteDictionary = new SortedDictionary<uint, HallowedSummonerEmote>();
    var isSaved = false;
    // Fetch and process all summoner-emote.json with translations
    foreach (LocaleIdentifier locale in Enum.GetValues(typeof(LocaleIdentifier)))
    {
        var localeIdentifierString = localeIdentifierMapper.GetValueOrThrow(locale);
        var emotes = await summonerEmoteService.ListAsync(localeIdentifierString);
        foreach (var emote in emotes)
        {
            HallowedSummonerEmote? hallowedEmote;
            if (hallowedEmoteDictionary.ContainsKey(emote.Id))
            {
                hallowedEmoteDictionary.TryGetValue(emote.Id, out hallowedEmote);
                if (hallowedEmote == null)
                    throw new NoNullAllowedException();
            }
            else
            {
                hallowedEmote = HallowedSummonerEmote.FromSummonerEmote(emote);
            }

            hallowedEmote.Translations[localeIdentifierString] = new()
            {
                Name = emote.Name,
                Description = emote.Description
            };
            hallowedEmoteDictionary[emote.Id] = hallowedEmote;

            if (!emote.IsIcon) continue;
            if (!isSaved && IsOptionSet(get))
            {
                var filePath = GetEmotesPath(emote.FileName);
                if (File.Exists(filePath)) continue;

                var bytes = await summonerEmoteService.GetBytesAsync(emote.Uri);
                Console.WriteLine($"Saving file to {filePath}");
                Directory.CreateDirectory(GetEmotesPath(""));
                await File.WriteAllBytesAsync(filePath, bytes);
            }
        }
        isSaved = true;
    }

    // Serialize and save hallowed summoner emotes
    var options = new JsonSerializerOptions
    {
        WriteIndented = true,
        // Handle special i18n characters properly
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };
    string currentEmoteJson = JsonSerializer.Serialize(hallowedEmoteDictionary, options);
    Directory.CreateDirectory(GetEmotesPath(""));
    var jsonPath = GetEmotesPath("hallowed-summoner-emotes.json");

    if (IsOptionSet(diff))
    {
        string? oldEmoteJson = null;
        if (File.Exists(jsonPath))
            oldEmoteJson = await File.ReadAllTextAsync(jsonPath);
        if (!string.IsNullOrEmpty(oldEmoteJson))
        {
            // Compare
            var jdp = new JsonDiffPatch();
            var output = jdp.Diff(oldEmoteJson, currentEmoteJson);
            if (!string.IsNullOrEmpty(output))
            {
                var unixTimestamp = (long)DateTime.UtcNow.Subtract(DateTime.UnixEpoch).TotalSeconds;
                var diffFilePath = GetEmotesPath($"{unixTimestamp}-diff-hallowed-summoner-emotes.json");
                Console.WriteLine($"Writing diff file to {diffFilePath}");
                await File.WriteAllTextAsync(diffFilePath, output);
            }
        }
    }
    await File.WriteAllTextAsync(GetEmotesPath("hallowed-summoner-emotes.json"), currentEmoteJson);
}

bool IsOptionSet(CommandOption option)
{
    return option.Values.Count > 0 ? true : false;
}

string GetEmotesPath(string appendPath)
{
    return GetCurrentPath($"Emotes/{appendPath}");
}

string GetCurrentPath(string appendPath)
{
    string value = path?.Value() ?? "";
    if (string.IsNullOrEmpty(value)) return appendPath;

    // Throw if path is invalid
    Path.GetDirectoryName(value);

    string absolute = value;
    if (!Path.IsPathRooted(value))
        absolute = Path.GetFullPath(value);
    return Path.Combine(absolute, appendPath);
}