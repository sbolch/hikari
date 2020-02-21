const kuroshiro = new Kuroshiro();
const text    = document.getElementById('text');
const meaning = document.getElementById('meaning');
const error   = document.getElementById('error');
const loader  = document.getElementById('loader');

chrome.tabs.executeScript({
    code: "window.getSelection().toString().trim();"
}, selection => getResult(selection[0]).then(() => loader.style.display = 'none'));

async function getResult(string) {
    if(string.length > 0) {
        loader.style.display = 'block';

        await kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'dict' }));

        if(Kuroshiro.Util.hasKanji(string)) {
            let chars = string.split('');

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

                    text.innerHTML += `<ruby lang="ja">${chars[i]}<rt>${kana}</rt></ruby>`;
                } else {
                    text.innerHTML += chars[i];
                }
            }

            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(this.readyState === 4 && this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    meaning.innerHTML = response.data[0].senses[0].english_definitions[0];
                }
            };
            xhr.open('GET', 'https://jisho.org/api/v1/search/words?keyword=' + string, true);
            xhr.send();
        } else {
            error.innerHTML = 'No kanji is selected.';
        }
    } else {
        error.innerHTML = 'No kanji is selected.';
    }
}
