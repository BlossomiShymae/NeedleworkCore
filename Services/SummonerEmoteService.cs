
using System.Collections.Immutable;
using System.Data;
using System.Net.Http.Json;
using Models;

namespace Services;

public class SummonerEmoteService
{
    private static readonly string _url = "https://raw.communitydragon.org";
    private static readonly HttpClient _client = new();

    public string DefaultUri
    {
        get => "/latest/plugins/rcp-be-lol-game-data/global/default";
    }

    public async Task<ImmutableList<SummonerEmote>> ListAsync(string localeIdentifier)
    {
        var data = await GetFromJsonAsync<List<SummonerEmote>>($"/latest/plugins/rcp-be-lol-game-data/global/{localeIdentifier}/v1/summoner-emotes.json");
        return data.ToImmutableList();
    }

    public async Task<byte[]> GetBytesAsync(string uri)
    {
        var bytes = await _client.GetByteArrayAsync($"{_url}{DefaultUri}{uri}");
        if (bytes == null)
            throw new NoNullAllowedException();
        return bytes;
    }

    private async Task<T> GetFromJsonAsync<T>(string uri)
    {
        var response = await _client.GetFromJsonAsync<T>($"{_url}{uri}");
        if (response == null)
            throw new NoNullAllowedException();
        return response;
    }
}