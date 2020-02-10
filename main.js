const kuroshiro = new Kuroshiro();
const kanji     = document.getElementById('kanji');
const kana      = document.getElementById('kana');
const loader    = document.getElementById('loader');

work().then(() => loader.style.display = 'none');

async function work() {
    loader.style.display = 'block';

    await kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'vendor/dict' }));

    let data = chrome.extension.getBackgroundPage();
    let text = data.text;

    kanji.innerHTML = text;
    kana.innerHTML  = (text.length > 0 && Kuroshiro.Util.hasKanji(text))
        ? await kuroshiro.convert(text)
        : 'No kanji is selected.';
}
