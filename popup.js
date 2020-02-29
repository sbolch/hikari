const kuroshiro = new Kuroshiro();
const text    = document.getElementById('text');
const meaning = document.getElementById('meaning');
const error   = document.getElementById('error');
const loader  = document.getElementById('loader');

chrome.tabs.executeScript({
    code: "window.getSelection().toString().trim();"
}, selection => getResult(selection[0]).then(() => loader.style.display  = 'none'));

async function getResult(string) {
    if(string.length > 0 && Kuroshiro.Util.hasKanji(string)) {
        let [kanaResult, meaningResult] = await Promise.all([getKana(string), getMeaning(string)]);
        for(kana of kanaResult) {
            text.appendChild(kana);
        }
        meaning.textContent = meaningResult;
    } else {
        error.textContent = 'No kanji is selected.';
    }
}

async function getKana(string) {
    await kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'dict' }));

    let chars  = string.split('');
    let result = [];
    for(let i = 0; i < chars.length; i++) {
        if(Kuroshiro.Util.isKanji(chars[i])) {
            let kana = await kuroshiro.convert(chars[i]);

            if(kana === chars[i] && (i + 1) < chars.length) {
                kana = await kuroshiro.convert(chars[i] + chars[i + 1]);

                if(Kuroshiro.Util.isKanji(chars[i + 1])) {
                    let nextKana = await kuroshiro.convert(chars[i + 1]);
                    kana = kana.replace(new RegExp(nextKana + '$'), '');
                } else {
                    kana = kana.replace(new RegExp(chars[i + 1] + '$'), '');
                }
            }

            let ruby = document.createElement('ruby');
            ruby.setAttribute('lang', 'ja');
            ruby.textContent = chars[i];

            let rt = document.createElement('rt');
            rt.textContent = kana;

            ruby.appendChild(rt);

            result.push(ruby);
        } else {
            let span = document.createElement('span');
            span.textContent = chars[i];

            result.push(span);
        }
    }

    return result;
}

async function getMeaning(string) {
    let jishoResponse = await (await fetch('https://jisho.org/api/v1/search/words?keyword=' + string)).json();
    return jishoResponse.data[0].senses[0].english_definitions[0];
}
