const kuroshiro = new Kuroshiro();
const kanji     = document.getElementById('kanji');
const kana      = document.getElementById('kana');
const loader    = document.getElementById('loader');

chrome.tabs.executeScript({
    code: "window.getSelection().toString().trim();"
}, selection => getResult(selection[0]).then(() => loader.style.display = 'none'));

async function getResult(text) {
    if(text.length > 0) {
        loader.style.display = 'block';

        await kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'dict' }));

        kanji.innerHTML = text;
        kana.innerHTML  = Kuroshiro.Util.hasKanji(text)
            ? await kuroshiro.convert(text)
            : 'No kanji is selected.';
    } else {
        kana.innerHTML = 'No kanji is selected.';
    }
}
