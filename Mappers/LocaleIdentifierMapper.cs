namespace Mappers;

public class LocaleIdentifierMapper 
{
    private readonly Dictionary<LocaleIdentifier, string> _map = new();

    public LocaleIdentifierMapper() 
    {
        _map.Add(LocaleIdentifier.CzechCzechia, "cs_cz");
        _map.Add(LocaleIdentifier.GermanGermany, "de_de");
        _map.Add(LocaleIdentifier.Default, "default");
        _map.Add(LocaleIdentifier.GreekGreece, "el_gr");
        _map.Add(LocaleIdentifier.EnglishAustralia, "en_au");
        _map.Add(LocaleIdentifier.EnglishUnitedKingdom, "en_gb");
        _map.Add(LocaleIdentifier.EnglishPhilippines, "en_ph");
        _map.Add(LocaleIdentifier.EnglishSingapore, "en_sg");
        _map.Add(LocaleIdentifier.SpanishArgentina, "es_ar");
        _map.Add(LocaleIdentifier.SpanishSpain, "es_es");
        _map.Add(LocaleIdentifier.SpanishMexico, "es_mx");
        _map.Add(LocaleIdentifier.FrenchFrance, "fr_fr");
        _map.Add(LocaleIdentifier.HungarianHungary, "hu_hu");
        _map.Add(LocaleIdentifier.ItalianItaly, "it_it");
        _map.Add(LocaleIdentifier.JapaneseJapan, "ja_jp");
        _map.Add(LocaleIdentifier.KoreanSouthKorea, "ko_kr");
        _map.Add(LocaleIdentifier.PolishPoland, "pl_pl");
        _map.Add(LocaleIdentifier.PortugueseBrazil, "pt_br");
        _map.Add(LocaleIdentifier.RomanianRomania, "ro_ro");
        _map.Add(LocaleIdentifier.RussianRussia, "ru_ru");
        _map.Add(LocaleIdentifier.ThaiThailand, "th_th");
        _map.Add(LocaleIdentifier.TurkishTurkey, "tr_tr");
        _map.Add(LocaleIdentifier.VietnameseVietnam, "vi_vn");
        _map.Add(LocaleIdentifier.UnknownVietnam, "vn_vn");
        _map.Add(LocaleIdentifier.ChineseChina, "zh_cn");
        _map.Add(LocaleIdentifier.ChineseMalaysia, "zh_my");
        _map.Add(LocaleIdentifier.ChineseTaiwan, "zh_tw");
    }

    public string GetValueOrThrow(LocaleIdentifier key)
    {
        var value = _map.GetValueOrDefault(key, "");
        if (string.IsNullOrEmpty(value))
            throw new ArgumentException($"Invalid argument: {key}");
        return value;
    }
}

public enum LocaleIdentifier {
    CzechCzechia,
    GermanGermany,
    Default,
    GreekGreece,
    EnglishAustralia,
    EnglishUnitedKingdom,
    EnglishPhilippines,
    EnglishSingapore,
    SpanishArgentina,
    SpanishSpain,
    SpanishMexico,
    FrenchFrance,
    HungarianHungary,
    ItalianItaly,
    JapaneseJapan,
    KoreanSouthKorea,
    PolishPoland,
    PortugueseBrazil,
    RomanianRomania,
    RussianRussia,
    ThaiThailand,
    TurkishTurkey,
    VietnameseVietnam,
    UnknownVietnam,
    ChineseChina,
    ChineseMalaysia,
    ChineseTaiwan
}